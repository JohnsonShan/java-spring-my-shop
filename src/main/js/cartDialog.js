// const React = require("react");
// const ReactDOM = require("react-dom");

import React from "react";
import ReactDOM from "react-dom";
import client from "./client";

export default class CartDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cartObj: [],
    };

    this.handleCart = this.handleCart.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleCart() {
    let cartObj = [];

    this.props.cart.map((item, i) => {
      if (i % 2 == 0) {
        return client({
          method: "GET",
          path: this.props.cart[i],
        }).done((product) => {
          cartObj.push({
            img: product.entity.img,
            name: product.entity.name,
            price: product.entity.price,
            quantity: this.props.cart[i + 1],
          });

          this.setState({
            cartObj: cartObj,
          });
        });
      }
    });
  }

  handleClick(e) {
    if (e.target.id == "cart") {
      location.href = "#";
    }
  }
  render() {
    window.addEventListener("load", this.handleCart);
    let total = 0.0;
    return (
      <div>
        <a
          className="m-2 btn btn-outline-primary"
          href="#cart"
          onClick={this.handleCart}
        >
          Cart {this.props.cart.length ? `(${this.props.cart.length / 2})` : ""}
        </a>

        <div id="cart" className="modalDialog" onClick={this.handleClick}>
          <div>
            {/* <a href="#" title="Close" className="close">
              X
            </a> */}

            <h2>Cart </h2>

            <div className="row mb-3 d-none d-lg-block">
              <div className="col">Product</div>
              <div className="col">Product Deatil</div>
              <div className="col">Unit price ($)</div>
              <div className="col">quantity</div>
              <div className="col">Subtotal ($)</div>
            </div>
            
            {this.state.cartObj.map((item, i) => {
              total += parseFloat(item.price) * parseFloat(item.quantity);
              return (
                <div key={i} className="row">
                  <div className="col ">
                    <img
                      className="image-fluid img-thumbnail "
                      src={`/images/${item.img}`}
                    />
                  </div>
                  <div className="col">{item.name}</div>
                  <div className="col">{item.price}</div>
                  <div className="col">{item.quantity}</div>
                  <div className="col">
                    {Math.round(
                      parseFloat(item.price) * parseFloat(item.quantity) * 100
                    ) / 100}
                  </div>
                </div>
              );
            })}
            <div className="row">
              <div className="col"></div>
              <div className="col">Sum: </div>
              <div className="col"></div>
              <div className="col"></div>
              <div className="col">{Math.round(total * 100) / 100}</div>
            </div>
            <button className="w-100 my-2">CheckOut (not implemented)</button>
          </div>
        </div>
      </div>
    );
  }
}
