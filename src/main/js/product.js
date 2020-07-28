import React from "react";
import ReactDOM from "react-dom";
import UpdateDialog from "./updateDialog";

export default class Product extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
  }

  handleDelete() {
    this.props.onDelete(this.props.product);
  }

  handleAddToCart(e) {
    function setCookie(cname, cvalue, exdays) {
      let d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      let expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
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

    for (let i = 0; i < cart.length; i += 2) {
      if (cart[i] == this.props.product.url) {
        cart[i + 1] = parseInt(cart[i + 1]) + 1;

        setCookie("cart", cart.join(", "), 365);
        this.props.updateCartFromCookie();
        // console.log(cart);
        return;
      }
    }

    cart.push(this.props.product.url);
    cart.push("1");
    setCookie("cart", cart.join(", "), 365);
    this.props.updateCartFromCookie();

    // console.log(cart);
  }
  render() {
    // console.log('this.props.product.url',this.props.product.url.substr(this.props.product.url.lastIndexOf('/')));
    return (
      <div className=" d-flex flex-column justify-content-center align-items-start col-6 col-sm-6 col-md-3">
        <div className="h-75 d-flex flex-column justify-content-center align-items-center">
          <img
            className="image-fluid img-thumbnail"
            src={`/images/${this.props.product.entity.img}`}
          />
        </div>

        <p>name: {this.props.product.entity.name}</p>
        <p>
          <s>old price: {this.props.product.entity.oldPrice}</s>
        </p>
        <p>price: {this.props.product.entity.price}</p>

        <div className="d-flex flex-column justify-content-center align-items-center w-100 mb-5">
          <button
            onClick={this.handleAddToCart}
            className="w-100 btn btn-outline-primary my-1"
          >
            Add to Cart
          </button>

          {this.props.auth ? (
            <UpdateDialog
              product={this.props.product}
              attributes={this.props.attributes}
              onUpdate={this.props.onUpdate}
              loggedInManager={this.props.loggedInManager}
            />
          ) : (
            <div></div>
          )}

          {this.props.auth ? (
            <button
              onClick={this.handleDelete}
              className="w-100 btn btn-danger my-1"
            >
              Delete
            </button>
          ) : (
            <div></div>
          )}
        </div>

      </div>
    );
  }
}
