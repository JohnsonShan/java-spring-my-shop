// const React = require("react");
// const ReactDOM = require("react-dom");

import React from "react";
import ReactDOM from "react-dom";

const client = require("./api/client");

export default class CreateDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: "/images/product.png",
      name: "",
      summary: "",
      price: "",
      oldPrice: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
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

    let form = new FormData();
    const file = document.querySelector("#file").files[0];
    form.append("file", file);

    this.props.postPhoto(form);

    window.location = "#";
  }

  handleImage(e) {
    let reader = new FileReader();
    reader.onload = () => {
      this.setState({
        image: reader.result,
      });
    };
    reader.readAsDataURL(e.target.files[0]);

    ReactDOM.findDOMNode(this.refs["image"]).value =
      "\\images" + e.target.value.substring(e.target.value.lastIndexOf("\\"));
  }

  handlePreview(e) {
    if (e.target.id == "price") {
      this.setState({
        price: e.target.value,
      });
    }
    if (e.target.id == "oldPrice") {
      this.setState({
        oldPrice: e.target.value,
      });
    }
    if (e.target.id == "name") {
      this.setState({
        name: e.target.value,
      });
    }
    if (e.target.id == "summary") {
      this.setState({
        summary: e.target.value,
      });
    }
  }

  render() {
    const inputs = this.props.attributes.map((attribute) => {
      return (
        <div key={attribute}>
          {attribute == "image" ? (
            <div>
              <input
                // value={this.state.image}
                id={attribute}
                type="text"
                placeholder={attribute}
                defaultValue="/images/product.png"
                ref={attribute}
                className="field w-100 my-2 d-none"
                disabled
              />
              <input
                id="file"
                type="file"
                placeholder={attribute}
                // ref={'file'}
                className="field w-100 my-2"
                // disabled
                // onClick={this.handleUpload}
                // onChange={()=>{console.log('change')}}
                onChange={this.handleImage}
              />
            </div>
          ) : (
            <input
              id={attribute}
              type="text"
              placeholder={attribute}
              ref={attribute}
              className="field w-100 my-2"
              onInput={this.handlePreview}
            />
          )}
        </div>
      );
    });
    return (
      <div>

        <div
          id="createModal"
          className="modal fade "
          tabIndex="-1"
          role="dialog"
          aria-labelledby="createModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-scrollable ">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="createModalLabel">
                  Add new product
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
                <form>{inputs}</form>

                <h2>Preview</h2>
                <div className="d-flex flex-column justify-content-center align-items-center w-50">
                  <img
                    className="image-fluid img-thumbnail"
                    src={this.state.image}
                  />
                </div>

                <p>{this.state.name || "name"}</p>
                <p>{this.state.summary || "summary"}</p>
                <p>
                  <s>{this.state.oldPrice || "old price"}</s>
                </p>
                <p>{this.state.price || "price"}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-toggle="modal"
                  data-target="#createModal"
                  onClick={this.handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
