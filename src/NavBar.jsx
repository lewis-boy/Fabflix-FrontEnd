import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";

import "./css/style.css";

class NavBar extends Component {
  render() {
    const { handleLogOut, loggedIn } = this.props;

    return (
      <nav className="nav-bar">
        <NavLink className="nav-link" to="/">
          Home
        </NavLink>
        {!loggedIn && (
          <Fragment>
            <NavLink className="nav-link" to="/login">
              Login
            </NavLink>
          </Fragment>
        )}
        {loggedIn && (
          <Fragment>
            <NavLink className="nav-link" to="/movies">
              Movies
            </NavLink>
            <button onClick={handleLogOut}>Log Out</button>
          </Fragment>
        )}
      </nav>
    );
  }
}

export default NavBar;
