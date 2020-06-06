import React, {Component} from "react";
import {Route, Switch} from "react-router-dom";

import Login from "./pages/Login";
import Movies from "./pages/Movies";
import Cart from "./pages/Cart"
import Home from "./pages/Home";
import Register from "./pages/Register";
import Index from "./pages/Index";
import ServerErrorPage from "./pages/ServerErrorPage";
import Complete from "./pages/Complete";
import OneMovie from "./pages/OneMovie";
import OrderHistory from "./pages/OrderHistory";
import People from "./pages/People";

import "./css/index.css";

class Content extends Component {
    //


    handleFirstVisit = (response) => {
        localStorage.setItem("firstVisit", "false");
        localStorage.setItem("movies", JSON.stringify(response["data"]["movies"]));
    };

    render() {
        const {handleLogIn, handleLogOut} = this.props;
        return (
            <div className="content">
                <Switch>
                    <Route
                        path="/servererror"
                        component={props => <ServerErrorPage {...props} />}
                    />
                    <Route
                        path="/login"
                        component={props => <Login handleLogIn={handleLogIn}{...props}/>}
                    />
                    <Route
                        path="/register"
                        component={props => <Register{...props} />}
                    />
                    <Route path="/home" component={props => <Home handleFirstVisit={this.handleFirstVisit}
                                                                  handleLogOut={handleLogOut}
                                                                  {...props} />}
                    />
                    <Route path="/movies/browse/:phrase" component={props => <Movies
                        handleLogOut={handleLogOut}
                        {...props}/>}
                    />
                    <Route path="/movies/get/:movie_id" component={props => <OneMovie
                        {...props} />}
                    />
                    <Route path="/movies/people/get/:person_id" component={props => <OneMovie
                        {...props} />}
                    />
                    <Route path="/movies/search" component={props => <Movies
                        handleLogOut={handleLogOut}
                        {...props}/>}
                    />
                    <Route path="/movies/people" component={props => <Movies
                        handleLogOut={handleLogOut}
                        {...props}/>}
                    />
                    <Route path="/movies" component={props => <Movies
                        handleLogOut={handleLogOut}
                        {...props}/>}
                    />
                    <Route path="/people" component={People}
                    />
                    <Route path="/billing/complete" component={Complete}
                    />
                    <Route path="/billing/cart" component={Cart}
                    />
                    <Route path="/billing/history" component={OrderHistory}
                    />

                    <Route exact path="/" component={Index}/>
                </Switch>
            </div>
        );
    }
}

export default Content;
