// const React = require("react");
// const ReactDOM = require("react-dom");

import React from "react";
import ReactDOM from "react-dom";

export default class CreateDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
  handleClick(e) {
    if (e.target.id == "createProduct") {
      location.href = "#";
    }
  }
  render() {
    const inputs = this.props.attributes.map((attribute) => (
      <p key={attribute}>
        <input
          type="text"
          placeholder={attribute}
          ref={attribute}
          className="field w-100 my-2"
        />
      </p>
    ));
    return (
      <div>
        <a href="#createProduct" className="m-2 btn btn-success">
          Add New Product
        </a>

        <div id="createProduct" className="modalDialog" onClick={this.handleClick}>
          <div>
            <h2>Add new product</h2>

            <form>
              {inputs}
              <button
                className="w-100 my-2 btn btn-outline-primary"
                onClick={this.handleSubmit}
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
