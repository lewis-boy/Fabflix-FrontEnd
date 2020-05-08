import React, {Component, Fragment} from "react";

import Movie from "../services/Movie";
import Billing from "../services/Billing";
import FilterBar from "../FilterBar"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import "../css/basicMovie.css";
import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";

import ClipLoader from "react-spinners/ClipLoader";
import {basicThumbnailMovieUrl} from "../Config";
import {NavLink} from "react-router-dom";


class Movies extends Component {
    state = {
        allMovies: [],
        errorMessage: ""
    };

    cartClick = (movie_id) => {
        console.log("Cart button clicked: " + movie_id)
        Billing.cartInsert(localStorage.getItem("email"), movie_id, 1)
            .then( response => {
                this.handleCartInsertResponse(response);
            })
            .catch(error => {
                this.props.history.push("/servererror");
            })
    };

    handleCartInsertResponse = (response) => {
        switch(response["data"]["resultCode"]){
            case 3100:
                this.props.history.push("/billing/cart/retrieve");
                break;
            default:
                break;
        }
    };

    createMovieItem = (movie) =>
        (
            <div className="movie-item-wrapper" key={movie.movie_id}>
                <NavLink to={"/movies/get/" + movie.movie_id}>
                    <img src={basicThumbnailMovieUrl + movie.poster_path} alt=""/>
                </NavLink>
                <table className="movie-item">
                    <thead className="head">
                    <tr>
                        <th className="title" colSpan="2">
                            <p>{movie.title}</p>
                            <button
                                onClick={() => {
                                    this.cartClick(movie.movie_id)
                                }}
                            >
                                <FontAwesomeIcon icon={faShoppingCart} size="1x"/>Add to Cart
                            </button>
                        </th>
                    </tr>
                    </thead>
                    <tbody className="body">
                    <tr>
                        <td className="field">Year:</td>
                        <td className="info">{movie.year}</td>
                    </tr>
                    <tr>
                        <td className="field">Director:</td>
                        <td className="info">{movie.director}</td>
                    </tr>
                    <tr>
                        <td className="field">Rating:</td>
                        <td className="info">{movie.rating}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );

    updateMovieTable = (response) => {
        let movies;
        movies = <div className="movie-gallery">{response["data"]["movies"].map(this.createMovieItem)}</div>
        this.setState({
            allMovies: movies
        })
    }

    handleMovieResponse = (response) => {
        switch (response["data"]["resultCode"]) {
            case 210:
                console.log("we in 210");
                this.updateMovieTable(response);
                break;
            case 211:
                console.log("we in 211");
                this.setState({allMovies: []});
                break;
            default:
                console.log("we in default");
                this.props.handleLogOut();
                break;
        }
    }
    //TODO MAKE SURE TO SHOW PAGE WHEN NO MOVIES ARE FOUND. 211?

    componentDidMount() {
        console.log(this.props.match.params);
        console.log(this.props.location.search);
        //console.log(this.props.match.url);
        this.unlisten = this.props.history.listen((location, action) => {
            console.log("on route change");
        });


        switch (this.props.match.path) {
            case "/movies/browse/:phrase":
                console.log("browse/phrase case");
                Movie.browseSearch(this.props.match.params.phrase, this.props.location.search)
                    .then(response => {
                            this.handleMovieResponse(response);
                        }
                    )
                    .catch(error => {
                        this.props.history.push("/servererror");
                    });
                break;
            case "/movies/people":
                console.log("movies/people case");
                Movie.peopleSearch(this.props.location.search)
                    .then(response => {
                        this.handleMovieResponse(response);
                    })
                    .catch(error => {
                        this.props.history.push("/servererror");
                    });
                break;
            case "/movies/search":
                console.log("movies/search case");
                Movie.basicSearch(this.props.location.search)
                    .then(response => {
                        this.handleMovieResponse(response);
                    })
                    .catch(error => {
                        this.props.history.push("/servererror");
                    });
                break;
            default:
                console.log("default case");
                Movie.search()
                    .then(response => {
                        this.handleMovieResponse(response);
                    })
                    .catch(error => {
                        this.props.history.push("/servererror");
                    });
        }
    }

    componentWillUnmount() {
        this.unlisten();
    }


    render() {
        const {allMovies} = this.state;
        return (
            <div className="wrapper">
                {(allMovies.length === 0) &&
                <Fragment>
                    <h1>FETCHING YOUR MOVIES</h1>
                    <ClipLoader
                        size={150}
                        color={"#FF0000"}
                        loading={allMovies.length === 0}
                    />
                </Fragment>}
                {(allMovies.length !== 0) &&
                <Fragment>
                    <FilterBar/>
                    {allMovies}
                </Fragment>}
            </div>);
    }
}

export default Movies;
