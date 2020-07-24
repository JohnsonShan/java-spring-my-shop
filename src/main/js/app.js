"use strict";

import CreateDialog from "./createDialog";
import UpdateDialog from "./updateDialog";
import Product from "./product";
import ProductList from "./productList";
import Nav from "./nav";
import CartDialog from "./cartDialog";
// import Test from './../resources/static/images/test.png';
import { useState, useEffect } from "react";
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
      pageSize: 12,
      links: {},
      loggedInManager: this.props.loggedInManager,
      cart: [],
    };
    this.updatePageSize = this.updatePageSize.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onNavigate = this.onNavigate.bind(this);
    this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
    this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this);
    this.updateCartFromCookie = this.updateCartFromCookie.bind(this);
  }

  updateCartFromCookie() {
    function getCookie(cname) {
      let name = cname + "=";
      let ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    let cart = getCookie("cart").split(", ");
    if (cart[0] == "") {
      cart.splice(0, 1);
    }

    this.setState({
      cart: cart,
    });
  }

  loadFromServer(pageSize) {
    follow(client, root, [{ rel: "products", params: { size: pageSize } }])
      .then((productCollection) => {
        return client({
          method: "GET",
          path: productCollection.entity._links.profile.href,
          headers: { Accept: "application/schema+json" },
        }).then((schema) => {
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

    this.updateCartFromCookie();
  }
  // end::register-handlers[]

  render() {
    return (
      <div className="container d-flex flex-column justify-content-center align-items-center">
        {/* <div className="container-fluid d-flex flex-column justify-content-center align-items-center d-none">
          notice
        </div> */}

        <Nav
          products={this.state.products}
          cart={this.state.cart}
          updateCartFromCookie={this.updateCartFromCookie}
        />

        <div id='logo' className="card mb-5">
          <a className="stretched-link" href="/">
            <i className="fas fa-robot rounded text-dark "> Johnson'shop</i>
          </a>
        </div>

        {/* <div className="container-fluid d-flex flex-column justify-content-center align-items-center">
          slide or highlight
        </div>

        <div>category</div>
        <div>highlight/default product list</div>
        <div>footer</div> */}

        {/* <CreateDialog
          attributes={this.state.attributes}
          onCreate={this.onCreate}
        /> */}

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
          cart={this.state.cart}
          updateCartFromCookie={this.updateCartFromCookie}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <App loggedInManager={document.getElementById("managername").innerHTML} />,
  document.getElementById("react")
);
