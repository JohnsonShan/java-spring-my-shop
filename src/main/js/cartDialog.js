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
            <h2>Cart </h2>

            <div className="row mb-3 ">
              <div className="col-3">Product</div>
              <div className="col-3">Deatil</div>
              <div className="col-6">
                <div className="float-right">Subtotal (HK$)</div>
              </div>
            </div>

            {this.state.cartObj.map((item, i) => {
              total += parseFloat(item.price) * parseFloat(item.quantity);
              return (
                <div key={i} className="row">
                  <div className="col-3">
                    <img
                      className="image-fluid img-thumbnail "
                      src={`/images/${item.img}`}
                    />
                  </div>
                  <div className="col-3">{item.name}</div>

                  <div className="col-6 float-right">
                    <div className="float-right mb-2">
                      {item.quantity} * ${item.price}
                    </div>
                    <br />
                    <div className="float-right mb-2">

                    </div>
                  </div>
                </div>
              );
            })}
            <div className="row">
              <div className="col-3"></div>
              <div className="col-3">Sum: </div>

              <div className="col-6 ">
                <div className="float-right">
                  ${Math.round(total * 100) / 100}
                </div>
              </div>
            </div>
            <button className="w-100 my-2 btn btn-outline-primary">
              CheckOut (not implemented)
            </button>
          </div>
        </div>
      </div>
    );
  }
}
