// const React = require("react");
// const ReactDOM = require("react-dom");

import React from 'react';
import ReactDOM from 'react-dom';

export default class CreateDialog extends React.Component {
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
