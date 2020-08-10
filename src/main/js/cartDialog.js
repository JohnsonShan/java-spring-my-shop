// const React = require("react");
// const ReactDOM = require("react-dom");

import React from "react";
import ReactDOM from "react-dom";
import client from "./api/client";

export default class CartDialog extends React.Component {
  constructor(props) {
    super(props);


  
  }



  render() {
    window.addEventListener("load", this.handleCart);
    let total = 0.0;
    return (
      <div>


        <div
          id="cartModal"
          className="modal fade"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="cartModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable  modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="cartModalLabel">
                  Cart
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row mb-3 ">
                  <div className="col-3">Product</div>
                  <div className="col-3">Deatil</div>
                  <div className="col-6">
                    <div className="float-right">Subtotal (HK$)</div>
                  </div>
                </div>

                {this.props.cart.map((item, i) => {
                  total += parseFloat(item.price) * parseFloat(item.quantity);
                  return (
                    <div key={i} className="row">
                      <div className="col-3">
                        <img
                          className="image-fluid img-thumbnail "
                          src={item.img}
                        />
                      </div>
                      <div className="col-3">{item.name}</div>

                      <div className="col-6 float-right">
                        <div className="float-right mb-2">
                          {item.quantity} * ${item.price}
                        </div>
                        <br />
                        <div className="float-right mb-2"></div>
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
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  CheckOut (not yet)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
