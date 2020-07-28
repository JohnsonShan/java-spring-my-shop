import React from "react";
import CartDialog from "./cartDialog";
import CreateDialog from "./createDialog";
export default class Nav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log("login", this.props.login);
    return (
      <div className=" container-fluid row mb-5">
        <div className="col-4 justify-content-start align-items-start">
          <div className="m-2">
            Hello, &nbsp;
            {this.props.login != "anonymousUser" ? this.props.login : "Guest"}
          </div>
        </div>
        <div className="col-8 d-flex flex-row justify-content-end align-items-end">
          {this.props.auth ? (
            <CreateDialog 
            attributes={this.props.attributes}
            onCreate={this.props.onCreate}
            />
            // <button className="m-2 btn btn-success">Add New Product</button>
          ) : (
            <div></div>
          )}

          {this.props.login == "anonymousUser" ? (
            <a className="m-2 btn btn-outline-primary" href="/login">
              Log In
            </a>
          ) : (
            <a className="m-2 btn btn-outline-primary" href="/logout">
              Lot out
            </a>
          )}

          {/* <button className="m-2 ">Cart ({itemInCart})</button> */}
          <CartDialog
            products={this.props.products}
            cart={this.props.cart}
            updateCartFromCookie={this.props.updateCartFromCookie}
          />
        </div>
      </div>
    );
  }
}
