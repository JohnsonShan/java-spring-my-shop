import React from "react";
import ReactDOM from "react-dom";
import Product from "./product";

export default class ProductList extends React.Component {
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
        Products - Page {this.props.page.number + 1} of
        {this.props.page.totalPages}
      </h3>
    ) : null;

    const products = this.props.products.map((product) => {
      return (
        <Product
          key={product.entity._links.self.href}
          product={product}
          attributes={this.props.attributes}
          onUpdate={this.props.onUpdate}
          onDelete={this.props.onDelete}
          auth={this.props.auth}
          loggedInManager={this.props.loggedInManager}
          cart={this.props.cart}
          updateCartFromCookie={this.props.updateCartFromCookie}
          postPhoto={this.props.postPhoto}
        />
      );
    });

    const navLinks = [];
    if ("first" in this.props.links) {
      navLinks.push(
        <button className='m-2 btn btn-outline-primary' key="first" onClick={this.handleNavFirst}>
          &lt;&lt;
        </button>
      );
    }
    if ("prev" in this.props.links) {
      navLinks.push(
        <button className='m-2 btn btn-outline-primary' key="prev" onClick={this.handleNavPrev}>
          &lt;
        </button>
      );
    }
    if ("next" in this.props.links) {
      navLinks.push(
        <button className='m-2 btn btn-outline-primary' key="next" onClick={this.handleNavNext}>
          &gt;
        </button>
      );
    }
    if ("last" in this.props.links) {
      navLinks.push(
        <button className='m-2 btn btn-outline-primary' key="last" onClick={this.handleNavLast}>
          &gt;&gt;
        </button>
      );
    }

    return (
      <div className="d-flex flex-column justify-content-center align-items-center">
        {pageInfo}
          <div className="row ">
            {products}
        </div>
        {/* <div className="d-flex flex-row "></div> */}

        {/* <input
            ref="pageSize"
            defaultValue={this.props.pageSize}
            onInput={this.handleInput}
          /> */}
        {/* <table>
            <tbody>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Manager</th>
                <th></th>
                <th></th>
              </tr>
              
            </tbody>
          </table> */}
        <div>{navLinks}</div>
      </div>
    );
  }
}
