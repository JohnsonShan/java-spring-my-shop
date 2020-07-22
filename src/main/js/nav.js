import React from "react";

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    function getCookie(cname) {
      let name = cname + "=";
      let ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }
    const itemInCart = getCookie('cart') ? getCookie('cart').split(', ').length / 2 : 0;
    return (
      <div className=" container-fluid row justify-content-end align-items-center mb-5">
        <button className="m-2 ">Log In</button>
    <button className="m-2 ">Cart ({itemInCart})</button>
      </div>
    );
  }
}
