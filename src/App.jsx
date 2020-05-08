import React, { Component } from "react";
import Axios from "axios";
import {withRouter} from "react-router-dom";

import NavBar from "./NavBar";
import Content from "./Content";

class App extends Component {
  state = {
    loggedIn: this.checkedLoggedIn()
  };

  handleLogIn = (email, session_id) => {
    const { common } = Axios.defaults.headers;

    localStorage.setItem("email", email);
    localStorage.setItem("firstVisit", "true");
    localStorage.setItem("session_id", session_id);

    common["email"] = email;
    common["session_id"] = session_id;

    this.setState({ loggedIn: true });
  };

  handleLogOut = () => {
      console.log("We in Log out Handler");
    const { common } = Axios.defaults.headers;
      console.log("Test 1");

    localStorage.removeItem("email");
    localStorage.removeItem("movies");
    localStorage.removeItem("firstVisit");
      console.log("Test 2");

    localStorage.removeItem("session_id");
      console.log("Test 3");

    console.log("DELETING EMAIL SESSIONiD TRANSACTIONID REQUEST DELAY");
    delete common["email"];
    delete common["session_id"];
    delete common["transaction_id"];
    delete common["request_delay"];

    this.setState({ loggedIn: false });
      console.log("Test 5");
    this.props.history.push("/");
      console.log("Test 6");
  };

  checkedLoggedIn() {
    console.log(localStorage.getItem("email") !== null ? localStorage.getItem("email") : "EMAIL does not exist")
    console.log(localStorage.getItem("session_id") !== null ? localStorage.getItem("session_id") : "SESSIONID does not exist")
    return (
      localStorage.getItem("email") !== null &&
      localStorage.getItem("session_id") !== null
    );
  }

  render() {
    const { loggedIn } = this.state;

    return (
      <div className="app">
        <NavBar handleLogOut={this.handleLogOut} loggedIn={loggedIn} />
        <Content handleLogOut={this.handleLogOut}
                 handleLogIn={this.handleLogIn} />
      </div>
    );
  }
}

export default withRouter(App);
