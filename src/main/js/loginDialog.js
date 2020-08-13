import React from "react";
import ReactDOM from "react-dom";

export default class LoginDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    // let form = document.querySelector("#loginForm");
    const data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    console.log(data);

    fetch("/login", {
      method: "POST",
      body: data,
    }).then(() => {
      location = "/";
    });
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value });
  }
  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  render() {
    return (
      <div>
        <div
          id="loginModal"
          className="modal fade "
          tabIndex="-1"
          role="dialog"
          aria-labelledby="loginModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-scrollable ">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="createModalLabel">
                  Log-in
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
                <form
                  onSubmit={this.handleSubmit}
                  id="loginForm"
                  // action="/login"
                  //   method="post"
                >
                  <label>Username:</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={this.state.username}
                    className="field w-100 my-2"
                    onChange={this.handleUsernameChange}
                    required
                  />
                  <label>Password:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={this.state.password}
                    className="field w-100 my-2"
                    onChange={this.handlePasswordChange}
                    required
                  />
                  {/* <input
                    className="btn btn-primary my-2"
                    type="submit"
                    value="Login"
                  /> */}
                </form>
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
                  //   data-toggle="modal"
                  //   data-target="#loginModal"
                  onClick={this.handleSubmit}
                >
                  Log-in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
