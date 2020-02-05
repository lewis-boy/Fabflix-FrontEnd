import React, {Component} from "react";
import {Route, Switch} from "react-router-dom";

import Login from "./pages/Login";
import Movies from "./pages/Movies";
import Home from "./pages/Home";
import Register from "./pages/Register"

import Movie from "../services/Movie.js";

class Content extends Component {
    state = {
        firstVisit: true,
        homePageMovies: ""
    };

    //functions for movies
    handleFirstVisit = (response) => {
        this.setState({
            homePageMovies: response["data"]["movies"],
            firstVisit: false
        });
    }

    render() {
        const {handleLogIn} = this.props;
        // {this.state.homePageMovies && <p>{this.state.homePageMovies[5]["title"]}</p>}
        //<Route path="/cart" component={Cart} />
        return (
            <div className="content">
                <Switch>
                    <Route
                        path="/login"
                        component={props => <Login handleLogIn={handleLogIn} {...props} />}
                    />
                    <Route
                        path="/register"
                        component={props => <Register{...props} />}
                    />
                    <Route path="/movies" component={props => <Movies
                                                                      {...props}/>}
                    />
                    <Route exact path="/" component={props => <Home firstVisit={this.state.firstVisit}
                                                                    handleFirstVisit={this.handleFirstVisit}
                                                                    homePageMovies={this.state.homePageMovies}
                                                                      {...props} />}
                    />
                </Switch>
            </div>
        );
    }
}

export default Content;
