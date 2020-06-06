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
        isMounted: false,
        errorMessage: "",
        rawMoviesResponse: [],
        pageSize: 0,
        pageNumber: 0
    };

    cartClick = (movie_id) => {
        console.log("Cart button clicked: " + movie_id);
        Billing.cartInsert(localStorage.getItem("email"), movie_id, 1)
            .then(response => {
                this.handleCartInsertResponse(response);
            })
            .catch(error => {
                this.props.history.push("/servererror");
            })
    };

    handleCartInsertResponse = (response) => {
        switch (response["data"]["resultCode"]) {
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
                    <img src={basicThumbnailMovieUrl + movie.poster_path}
                         onError={(e) => {
                             e.target.onerror = null;
                             e.target.src = "https://catalog.osaarchivum.org/assets/thumbnail_placeholder_movie-480596e192e7043677f77cf78b13bdd1.jpg";
                             e.target.className = "placeholder-image"
                         }}/>
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
        this.setState({
            rawMoviesResponse: response["data"]["movies"],
        })
    };

    handleMovieResponse = (response) => {
        switch (response["data"]["resultCode"]) {
            case 210:
                console.log("we in 210");
                this.updateMovieTable(response);
                break;
            case 211:
                console.log("we in 211");
                this.setState({errorMessage: response["data"]["message"]});
                break;
            default:
                console.log("we in default");
                this.props.handleLogOut();
                break;
        }
    };

    handlePageResponse = (response) => {
        switch (response["data"]["resultCode"]) {
            case 210:
                console.log("we in 210");
                this.setState({pageSize: response["data"]["movies"].length});
                break;
            case 211:
                console.log("we in 211");
                this.setState({errorMessage: response["data"]["message"]});
                break;
            default:
                console.log("we in default");
                this.props.handleLogOut();
                break;
        }
    };

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
                Movie.browseSearch(this.props.match.params.phrase, this.props.location.search + "&limit=100")
                    .then(response => {
                        this.handlePageResponse(response);
                        return (Movie.browseSearch(this.props.match.params.phrase, this.props.location.search))
                    })
                    .then(response => {
                            this.handleMovieResponse(response);
                            this.setState({
                                isMounted: true
                            });
                        }
                    )
                    .catch(error => {
                        console.log(error);
                        this.props.history.push("/servererror");
                    });
                break;
            case "/movies/people":
                console.log("movies/people case");
                Movie.peopleSearch(this.props.location.search + "&limit=100")
                    .then(response => {
                        this.handlePageResponse(response);
                        return (Movie.peopleSearch(this.props.location.search))
                    })
                    .then(response => {
                        this.handleMovieResponse(response);
                        this.setState({
                            isMounted: true
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        this.props.history.push("/servererror");
                    });
                break;
            case "/movies/search":
                console.log("movies/search case");
                Movie.basicSearch(this.props.location.search + "&limit=100")
                    .then(response => {
                        this.handlePageResponse(response);
                        return (Movie.basicSearch(this.props.location.search))
                    })
                    .then(response => {
                        this.handleMovieResponse(response);
                        this.setState({
                            isMounted: true
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        this.props.history.push("/servererror");
                    });
                break;
            default:
                console.log("default case");
                Movie.search()
                    .then(response => {
                        this.handleMovieResponse(response);
                        this.setState({
                            isMounted: true
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        this.props.history.push("/servererror");
                    });
        }
    }

    componentWillUnmount() {
        this.unlisten();
    }

    createPagination = () => {
        let pages = [];
        let amountOfPages = this.state.pageSize / 10;
        let clicked = "";
        for (let i = 0; i < amountOfPages; i++) {
            clicked = (this.state.pageNumber === i) ? "clicked" : "";
            pages.push(
                <button className={clicked} id={i} onClick={() => {
                    this.handlePageClick(i)
                }}>{i + 1}</button>
            )
        }
        return (
            pages
        )
    };

    //starting at 0
    handlePageClick = (pageNumber) => {
        let offset = pageNumber * 10;
        switch (this.props.match.path) {
            case "/movies/browse/:phrase":
                console.log("browse/phrase case");
                Movie.browseSearch(this.props.match.params.phrase, this.props.location.search + "&offset=" + offset)
                    .then(response => {
                            this.handleMovieResponse(response);
                            this.setState({pageNumber: pageNumber});
                        }
                    )
                    .catch(error => {
                        console.log(error);
                        this.props.history.push("/servererror");
                    });
                break;
            case "/movies/people":
                console.log("movies/people case");
                Movie.peopleSearch(this.props.location.search + "&offset=" + offset)
                    .then(response => {
                        this.handleMovieResponse(response);
                        this.setState({pageNumber: pageNumber});
                    })
                    .catch(error => {
                        console.log(error);
                        this.props.history.push("/servererror");
                    });
                break;
            case "/movies/search":
                console.log("movies/search case");
                Movie.basicSearch(this.props.location.search + "&offset=" + offset)
                    .then(response => {
                        this.handleMovieResponse(response);
                        this.setState({pageNumber: pageNumber});
                    })
                    .catch(error => {
                        console.log(error);
                        this.props.history.push("/servererror");
                    });
                break;
            default:
                console.log("default case");
                Movie.search(+"offset=" + offset)
                    .then(response => {
                        this.handleMovieResponse(response);
                        this.setState({pageNumber: pageNumber});
                    })
                    .catch(error => {
                        console.log(error);
                        this.props.history.push("/servererror");
                    });
        }

    };


    render() {
        const {isMounted, errorMessage, rawMoviesResponse, pageSize} = this.state;
        console.log(pageSize);
        return (
            <div className="wrapper">
                {
                    (rawMoviesResponse.length === 0) && (!isMounted) &&
                    <Fragment>
                        <h1>FETCHING YOUR MOVIES</h1>
                        <ClipLoader
                            size={150}
                            color={"#FF0000"}
                            loading={rawMoviesResponse.length === 0}
                        />
                    </Fragment>
                }

                {
                    (rawMoviesResponse.length === 0) && (isMounted) &&
                    <Fragment>
                        <h1>{errorMessage}</h1>
                    </Fragment>
                }


                {
                    (rawMoviesResponse.length !== 0) &&
                    <Fragment>
                        <FilterBar/>
                        <div className="movie-gallery">{rawMoviesResponse.map(this.createMovieItem)}</div>
                        <div className="pagination">
                            {this.createPagination()}
                        </div>
                    </Fragment>
                }
            </div>);
    }
}

export default Movies;
