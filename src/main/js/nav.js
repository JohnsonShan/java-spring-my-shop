import React from "react";
import CartDialog from "./cartDialog";
import CreateDialog from "./createDialog";
export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.toggleDropDown();
  }

  toggleDropDown() {
    const d = document.querySelector("#dropDown");
    const mn = document.querySelector("#mobile-nav");

    if (d.classList.contains("fade-in")) {
      mn.classList.remove("max-height-10");
      mn.style.height = "120vh";

      d.classList.remove("fade-in");
      d.classList.remove("from-top");

      d.classList.remove("pointer-none");
    } else {
      mn.classList.add("max-height-10");
      mn.style.height = "10vh";

      d.classList.add("fade-in");
      d.classList.add("from-top");

      d.classList.add("pointer-none");
    }
  }
  render() {
    window.addEventListener("scroll", () => {
      const d = document.querySelector("#dropDown");
      const mn = document.querySelector("#mobile-nav");

      mn.classList.add("max-height-10");
      mn.style.height = "10vh";

      d.classList.add("fade-in");
      d.classList.add("from-top");
    });
    // console.log("login", this.props.login);
    return (
      <div className="w-100 d-flex flex-column justify-content-center align-items-center">
        <div
          id="web-nav "
          className="container-fluid row bg-white d-none d-md-flex "
        >
          <div className="col-4 justify-content-start align-items-start ">
            <div className="m-2">
              Hello, &nbsp;
              {this.props.login != "anonymousUser" ? this.props.login : "Guest"}
            </div>
          </div>

          <div className="col-8 d-flex flex-row justify-content-end align-items-end">
            {this.props.auth ? (
              <button
                type="button"
                className="m-2 btn btn-success"
                data-toggle="modal"
                data-target="#createModal"
              >
                Add New Product
              </button>
            ) : (
              <div></div>
            )}

            {this.props.login == "anonymousUser" ? (
              <div>
                <button
                  type="button"
                  className="m-2 btn btn-outline-primary"
                  data-toggle="modal"
                  data-target="#loginModal"
                >
                  Log-in
                </button>
                <button
                  type="button"
                  className="m-2 btn btn-outline-primary"
                  data-toggle="modal"
                  data-target="#signupModal"
                >
                  Sign-up
                </button>
              </div>
            ) : (
              <a className="m-2 btn btn-outline-primary" href="/logout">
                Lot out
              </a>
            )}

            <button
              className="m-2 btn btn-outline-primary"
              // onClick={this.props.updateCartFromCookie}
              data-toggle="modal"
              data-target="#cartModal"
            >
              Cart
              {this.props.cart.length ? `(${this.props.cart.length})` : ""}
            </button>
          </div>
        </div>

        <div
          id="mobile-nav"
          className="container d-flex d-md-none flex-column bg-white max-height-10"
        >
          <div className=" d-flex justify-content-between">
            <span>
              <a className="" href="/">
                <i className="fas fa-robot rounded text-dark ">
                  &nbsp;Johnson'shop
                </i>
              </a>
            </span>

            <div id="dropIcon">
              <span>
                <a href="#" className="" onClick={this.handleClick}>
                  <i className="fas fa-bars icon rounded text-black-50"></i>
                </a>
              </span>
            </div>
          </div>
          <div
            id="dropDown"
            className="d-flex flex-column justify-content-start align-items-start fade-in from-top transition-500 pointer-none"
          >
            {this.props.auth ? (
              <button
                type="button"
                className="m-2 btn btn-success"
                data-toggle="modal"
                data-target="#createModal"
              >
                Add New Product
              </button>
            ) : (
              <div></div>
            )}

            <button
              className="m-2 btn btn-outline-primary"
              // onClick={this.props.updateCartFromCookie}
              data-toggle="modal"
              data-target="#cartModal"
            >
              Cart
              {this.props.cart.length ? `(${this.props.cart.length})` : ""}
            </button>

            <div className="add-thin-line m-2"></div>

            <div className="m-2">
              Hello, &nbsp;
              {this.props.login != "anonymousUser" ? this.props.login : "Guest"}
            </div>
            {this.props.login == "anonymousUser" ? (
              <a className="m-2 btn btn-outline-primary" href="/login">
                Log In
              </a>
            ) : (
              <a className="m-2 btn btn-outline-primary" href="/logout">
                Lot out
              </a>
            )}
          </div>
        </div>

        {/* <div className='add-thin-line  d-flex d-lg-none'></div> */}
      </div>
    );
  }
}
