const React = require("react");
const ReactDOM = require("react-dom");

export default class UpdateDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: this.props.product.entity.image,
      name: this.props.product.entity.name,
      summary: this.props.product.entity.summary,
      price: this.props.product.entity.price,
      oldPrice: this.props.product.entity.oldPrice,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const updatedProduct = {};
    this.props.attributes.forEach((attribute) => {
      updatedProduct[attribute] = ReactDOM.findDOMNode(
        this.refs[attribute]
      ).value.trim();
    });
    this.props.onUpdate(this.props.product, updatedProduct);

    let form = new FormData();
    const file = this.refs["file"].files[0];
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
    const inputs = this.props.attributes.map((attribute, i) => (
      <div
        key={
          "updateProduct-" +
          this.props.product.entity._links.self.href +
          "attribute" +
          i
        }
      >
        {attribute == "image" ? (
          <div>
            <input

              id={attribute}
              type="text"
              placeholder={attribute}
              defaultValue={this.props.product.entity[attribute]}
              ref={attribute}
              className="field w-100 my-2 d-none"
              disabled
            />
            <input
              // id="file"
              type="file"
              placeholder={attribute}
              ref="file"
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
            defaultValue={this.props.product.entity[attribute]}
            ref={attribute}
            className="field w-100 my-2"
            onInput={this.handlePreview}
          />
        )}
      </div>
    ));

    const dialogId =
      "updateProduct" +
      this.props.product.entity._links.self.href.substring(
        this.props.product.entity._links.self.href.lastIndexOf("/") + 1
      );

    const target = "#" + dialogId;

    // console.log("dialogId", dialogId);
    // console.log("target", target);
    return (
      <div className="w-100">
        <button
          type="button"
          className="btn btn-primary w-100"
          data-toggle="modal"
          data-target={target}
        >
          Update
        </button>

        <div
          className="modal fade"
          id={dialogId}
          tabIndex="-1"
          role="dialog"
          aria-labelledby="updateModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="updateModalLabel">
                  Update
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
                    src={this.state.img}
                  />
                </div>

                <p>{this.state.name}</p>
                <p>{this.state.summary}</p>
                <p>
                  <s>HK${this.state.oldPrice}</s>
                </p>
                <p>HK${this.state.price}</p>
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
                  data-target={target}
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
