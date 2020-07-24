import React from "react";
import CartDialog from "./cartDialog";
export default class Nav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className=" container-fluid row justify-content-end align-items-center mb-5">
        <button className="m-2 btn btn-outline-primary">Log In</button>
        {/* <button className="m-2 ">Cart ({itemInCart})</button> */}
        <CartDialog 
          products={this.props.products}
          cart={this.props.cart}
          updateCartFromCookie={this.props.updateCartFromCookie}
        />
      </div>
    );
  }
}
