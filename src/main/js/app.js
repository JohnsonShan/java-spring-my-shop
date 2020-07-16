"use strict";

const React = require("react");
const ReactDOM = require("react-dom");
const when = require("when");
const client = require("./client");

const follow = require("./follow"); // function to hop multiple links by "rel"

const stompClient = require("./websocket-listener");

const root = "/api";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      attributes: [],
      page: 1,
      pageSize: 5,
      links: {},
      loggedInManager: this.props.loggedInManager,
    };
    this.updatePageSize = this.updatePageSize.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onNavigate = this.onNavigate.bind(this);
    this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
    this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this);
  }

  loadFromServer(pageSize) {
    follow(client, root, [{ rel: "products", params: { size: pageSize } }])
      .then((productCollection) => {
		  console.log('productCollection',productCollection)
        return client({
          method: "GET",
          path: productCollection.entity._links.profile.href,
          headers: { Accept: "application/schema+json" },
        }).then((schema) => {
          console.log("schema", schema.entity);
          // tag::json-schema-filter[]
          /**
           * Filter unneeded JSON Schema properties, like uri references and
           * subtypes ($ref).
           */
          Object.keys(schema.entity.properties).forEach(function (property) {
            if (
              schema.entity.properties[property].hasOwnProperty("format") &&
              schema.entity.properties[property].format === "uri"
            ) {
              delete schema.entity.properties[property];
            } else if (
              schema.entity.properties[property].hasOwnProperty("$ref")
            ) {
              delete schema.entity.properties[property];
            }
          });

          this.schema = schema.entity;
          this.links = productCollection.entity._links;
          return productCollection;
          // end::json-schema-filter[]
        });
      })
      .then((productCollection) => {
        this.page = productCollection.entity.page;
        return productCollection.entity._embedded.products.map((product) =>
          client({
            method: "GET",
            path: product._links.self.href,
          })
        );
      })
      .then((productPromises) => {
        return when.all(productPromises);
      })
      .done((products) => {
		  console.log('products',products)	
        this.setState({
          page: this.page,
          products: products,
          attributes: Object.keys(this.schema.properties),
          pageSize: pageSize,
          links: this.links,
        });
      });
  }

  // tag::on-create[]
  onCreate(newProduct) {
    follow(client, root, ["products"]).done((response) => {
      client({
        method: "POST",
        path: response.entity._links.self.href,
        entity: newProduct,
        headers: { "Content-Type": "application/json" },
      });
    });
  }
  // end::on-create[]

  // tag::on-update[]
  onUpdate(product, updatedProduct) {
    if (product.entity.manager.name === this.state.loggedInManager) {
      updatedProduct["manager"] = product.entity.manager;
      client({
        method: "PUT",
        path: product.entity._links.self.href,
        entity: updatedProduct,
        headers: {
          "Content-Type": "application/json",
          "If-Match": product.headers.Etag,
        },
      }).done(
        (response) => {
          /* Let the websocket handler update the state */
        },
        (response) => {
          if (response.status.code === 403) {
            alert(
              "ACCESS DENIED: You are not authorized to update " +
                product.entity._links.self.href
            );
          }
          if (response.status.code === 412) {
            alert(
              "DENIED: Unable to update " +
                product.entity._links.self.href +
                ". Your copy is stale."
            );
          }
        }
      );
    } else {
      alert("You are not authorized to update");
    }
  }
  // end::on-update[]

  // tag::on-delete[]
  onDelete(product) {
    client({ method: "DELETE", path: product.entity._links.self.href }).done(
      (response) => {
        /* let the websocket handle updating the UI */
      },
      (response) => {
        if (response.status.code === 403) {
          alert(
            "ACCESS DENIED: You are not authorized to delete " +
              product.entity._links.self.href
          );
        }
      }
    );
  }
  // end::on-delete[]

  onNavigate(navUri) {
    client({
      method: "GET",
      path: navUri,
    })
      .then((productCollection) => {
        this.links = productCollection.entity._links;
        this.page = productCollection.entity.page;

        return productCollection.entity._embedded.products.map((product) =>
          client({
            method: "GET",
            path: product._links.self.href,
          })
        );
      })
      .then((productPromises) => {
        return when.all(productPromises);
      })
      .done((products) => {
        this.setState({
          page: this.page,
          products: products,
          attributes: Object.keys(this.schema.properties),
          pageSize: this.state.pageSize,
          links: this.links,
        });
      });
  }

  updatePageSize(pageSize) {
    if (pageSize !== this.state.pageSize) {
      this.loadFromServer(pageSize);
    }
  }

  // tag::websocket-handlers[]
  refreshAndGoToLastPage(message) {
    follow(client, root, [
      {
        rel: "products",
        params: { size: this.state.pageSize },
      },
    ]).done((response) => {
      if (response.entity._links.last !== undefined) {
        this.onNavigate(response.entity._links.last.href);
      } else {
        this.onNavigate(response.entity._links.self.href);
      }
    });
  }

  refreshCurrentPage(message) {
    follow(client, root, [
      {
        rel: "products",
        params: {
          size: this.state.pageSize,
          page: this.state.page.number,
        },
      },
    ])
      .then((productCollection) => {
        this.links = productCollection.entity._links;
        this.page = productCollection.entity.page;

        return productCollection.entity._embedded.products.map((product) => {
          return client({
            method: "GET",
            path: product._links.self.href,
          });
        });
      })
      .then((productPromises) => {
        return when.all(productPromises);
      })
      .then((products) => {
        this.setState({
          page: this.page,
          products: products,
          attributes: Object.keys(this.schema.properties),
          pageSize: this.state.pageSize,
          links: this.links,
        });
      });
  }
  // end::websocket-handlers[]

  // tag::register-handlers[]
  componentDidMount() {
    this.loadFromServer(this.state.pageSize);
    stompClient.register([
      { route: "/topic/newProduct", callback: this.refreshAndGoToLastPage },
      { route: "/topic/updateProduct", callback: this.refreshCurrentPage },
      { route: "/topic/deleteProduct", callback: this.refreshCurrentPage },
    ]);
  }
  // end::register-handlers[]

  render() {
    return (
      <div>
        <CreateDialog
          attributes={this.state.attributes}
          onCreate={this.onCreate}
        />
        <ProductList
          page={this.state.page}
          products={this.state.products}
          links={this.state.links}
          pageSize={this.state.pageSize}
          attributes={this.state.attributes}
          onNavigate={this.onNavigate}
          onUpdate={this.onUpdate}
          onDelete={this.onDelete}
          updatePageSize={this.updatePageSize}
          loggedInManager={this.state.loggedInManager}
        />
      </div>
    );
  }
}

class CreateDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const newProduct = {};
    this.props.attributes.forEach((attribute) => {
      newProduct[attribute] = ReactDOM.findDOMNode(
        this.refs[attribute]
      ).value.trim();
    });
    this.props.onCreate(newProduct);
    this.props.attributes.forEach((attribute) => {
      ReactDOM.findDOMNode(this.refs[attribute]).value = ""; // clear out the dialog's inputs
    });
    window.location = "#";
  }

  render() {
    const inputs = this.props.attributes.map((attribute) => (
      <p key={attribute}>
        <input
          type="text"
          placeholder={attribute}
          ref={attribute}
          className="field"
        />
      </p>
    ));
    return (
      <div>
        <a href="#createProduct">Create</a>

        <div id="createProduct" className="modalDialog">
          <div>
            <a href="#" title="Close" className="close">
              X
            </a>

            <h2>Create new product</h2>

            <form>
              {inputs}
              <button onClick={this.handleSubmit}>Create</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

class UpdateDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const updatedProduct = {};
    this.props.attributes.forEach((attribute) => {
      updatedProduct[attribute] = ReactDOM.findDOMNode(
        this.refs[attribute]
      ).value.trim();
    });
    this.props.onUpdate(this.props.product, updatedProduct);
    window.location = "#";
  }

  render() {
    const inputs = this.props.attributes.map((attribute) => (
      <p key={this.props.product.entity[attribute]}>
        <input
          type="text"
          placeholder={attribute}
          defaultValue={this.props.product.entity[attribute]}
          ref={attribute}
          className="field"
        />
      </p>
    ));

    const dialogId =
      "updateProduct-" + this.props.product.entity._links.self.href;

    const isManagerCorrect =
      this.props.product.entity.manager.name == this.props.loggedInManager;

    if (isManagerCorrect === false) {
      return (
        <div>
          <a>Not Your Product</a>
        </div>
      );
    } else {
      return (
        <div>
          <a href={"#" + dialogId}>Update</a>

          <div id={dialogId} className="modalDialog">
            <div>
              <a href="#" title="Close" className="close">
                X
              </a>

              <h2>Update an product</h2>

              <form>
                {inputs}
                <button onClick={this.handleSubmit}>Update</button>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }
}

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.handleNavFirst = this.handleNavFirst.bind(this);
    this.handleNavPrev = this.handleNavPrev.bind(this);
    this.handleNavNext = this.handleNavNext.bind(this);
    this.handleNavLast = this.handleNavLast.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(e) {
    e.preventDefault();
    const pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
    if (/^[0-9]+$/.test(pageSize)) {
      this.props.updatePageSize(pageSize);
    } else {
      ReactDOM.findDOMNode(this.refs.pageSize).value = pageSize.substring(
        0,
        pageSize.length - 1
      );
    }
  }

  handleNavFirst(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.first.href);
  }

  handleNavPrev(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.prev.href);
  }

  handleNavNext(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.next.href);
  }

  handleNavLast(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.last.href);
  }

  render() {
    const pageInfo = this.props.page.hasOwnProperty("number") ? (
      <h3>
        Products - Page {this.props.page.number + 1} of{" "}
        {this.props.page.totalPages}
      </h3>
    ) : null;

    const products = this.props.products.map((product) => (
      <Product
        key={product.entity._links.self.href}
        product={product}
        attributes={this.props.attributes}
        onUpdate={this.props.onUpdate}
        onDelete={this.props.onDelete}
        loggedInManager={this.props.loggedInManager}
      />
    ));

    const navLinks = [];
    if ("first" in this.props.links) {
      navLinks.push(
        <button key="first" onClick={this.handleNavFirst}>
          &lt;&lt;
        </button>
      );
    }
    if ("prev" in this.props.links) {
      navLinks.push(
        <button key="prev" onClick={this.handleNavPrev}>
          &lt;
        </button>
      );
    }
    if ("next" in this.props.links) {
      navLinks.push(
        <button key="next" onClick={this.handleNavNext}>
          &gt;
        </button>
      );
    }
    if ("last" in this.props.links) {
      navLinks.push(
        <button key="last" onClick={this.handleNavLast}>
          &gt;&gt;
        </button>
      );
    }

    return (
      <div>
        {pageInfo}
        <input
          ref="pageSize"
          defaultValue={this.props.pageSize}
          onInput={this.handleInput}
        />
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Manager</th>
              <th></th>
              <th></th>
            </tr>
            {products}
          </tbody>
        </table>
        <div>{navLinks}</div>
      </div>
    );
  }
}

// tag::product[]
class Product extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    this.props.onDelete(this.props.product);
  }

  render() {
	  console.log('this.props.product',this.props.product);
    return (
      <tr>
        <td>{this.props.product.entity.name}</td>
        <td>{this.props.product.entity.description}</td>
        <td>{this.props.product.entity.manager.name}</td>
        <td>
          <UpdateDialog
            product={this.props.product}
            attributes={this.props.attributes}
            onUpdate={this.props.onUpdate}
            loggedInManager={this.props.loggedInManager}
          />
        </td>
        <td>
          <button onClick={this.handleDelete}>Delete</button>
        </td>
      </tr>
    );
  }
}
// end::product[]

ReactDOM.render(
  <App loggedInManager={document.getElementById("managername").innerHTML} />,
  document.getElementById("react")
);
