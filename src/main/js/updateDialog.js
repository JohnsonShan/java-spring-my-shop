const React = require("react");
const ReactDOM = require("react-dom");

export default class UpdateDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  render() {
    const inputs = this.props.attributes.map((attribute) => (
      <p key={this.props.product.entity[attribute]}>
        <input
          type="text"
          placeholder={attribute}
          defaultValue={this.props.product.entity[attribute]}
          ref={attribute}
          className="field"
        />
      </p>
    ));

    const dialogId =
      "updateProduct-" + this.props.product.entity._links.self.href;

    const isManagerCorrect =
      this.props.product.entity.manager.name == this.props.loggedInManager;

    if (isManagerCorrect === false) {
      return (
        <div>
          <a>Not Your Product</a>
        </div>
      );
    } else {
      return (
        <div>
          <a href={"#" + dialogId}>Update</a>

          <div id={dialogId} className="modalDialog">
            <div>
              <a href="#" title="Close" className="close">
                X
              </a>

              <h2>Update an product</h2>

              <form>
                {inputs}
                <button onClick={this.handleSubmit}>Update</button>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }
}
