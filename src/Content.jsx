import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Login from "./pages/Login";
import Movies from "./pages/Movies";
import Home from "./pages/Home";

class Content extends Component {
  render() {
    const { handleLogIn } = this.props;

    return (
      <div className="content">
        <Switch>
          <Route
            path="/login"
            component={props => <Login handleLogIn={handleLogIn} {...props} />}
          />
          <Route path="/movies" component={Movies} />
          <Route path="/" component={Home} />
        </Switch>
      </div>
    );
  }
}

export default Content;
