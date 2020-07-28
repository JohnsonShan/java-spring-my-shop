const React = require("react");
const ReactDOM = require("react-dom");

export default class UpdateDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
    window.location = "#";
  }

  handleClick(e) {
    if (
      e.target.id ==
      "updateProduct-" + this.props.product.entity._links.self.href
    ) {
      location.href = "#";
    }
  }

  render() {
    const inputs = this.props.attributes.map((attribute, i) => (
      <p
        key={
          "updateProduct-" +
          this.props.product.entity._links.self.href +
          "attribute" +
          i
        }
      >
        <input
          type="text"
          placeholder={attribute}
          defaultValue={this.props.product.entity[attribute]}
          ref={attribute}
          className="field w-100 my-2"
        />
      </p>
    ));
    const dialogId =
      "updateProduct-" + this.props.product.entity._links.self.href;

    return (
      <div className="w-100">
        <a href={"#" + dialogId} className="w-100 btn btn-primary my-1">
          Update
        </a>

        <div id={dialogId} className="modalDialog " onClick={this.handleClick}>
          <div>
            <h2>Update an product</h2>

            <form>
              {inputs}
              <button
                onClick={this.handleSubmit}
                className="w-100 my-2 btn btn-outline-primary"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
