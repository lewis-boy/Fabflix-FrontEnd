import React, {Component, Fragment} from "react";


import "../css/home.css";
import "../css/common.css";

import Movie from "../services/Movie";
import {basicMovieUrl, basicStarUrl} from "../Config.json";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faChevronLeft,
    faChevronRight,
    faCopyright, faSearch, faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import Billing from "../services/Billing";

// https://wallpaperaccess.com/full/1561985.jpg


class Home extends Component {
    state = {
        rawMovies: [],
        frontPage: "",
        midPageSlide: [],
        midX: 0,
        starPage: [],
        starX: 0,
        timer: "",
        genreMap: [[]],
        homeGenre: ""
    };

    getStarName(passedMovie) {
        if (passedMovie === undefined)
            console.log("PassedMovie was undefined");
        let starList = passedMovie["stars"].split(",");
        let starName = starList[0].split(":")[0];
        return (starName);
    }

    getStarPath(passedMovie) {
        let starList = passedMovie["stars"].split(",");
        let starPath = starList[0].split(":")[1];
        return (starPath);
    }

    getWhatsTrendingIn = (passedMovie) => {
        return (
            //style={{transform: "translateX(" + this.state.midX + "%)"}}
            <div key={passedMovie["movie_id"]} className="slide"
                 style={{transform: "translateX(" + this.state.midX + "%)"}}>
                <img src={basicMovieUrl + passedMovie["poster_path"]}
                     onError={(e) => {
                         e.target.onerror = null;
                         e.target.src = "https://catalog.osaarchivum.org/assets/thumbnail_placeholder_movie-480596e192e7043677f77cf78b13bdd1.jpg"
                     }}/>
                <button className="scroll-shopping-button"
                        onClick={() => {this.cartClick(passedMovie["movie_id"])}}>
                    <FontAwesomeIcon icon={faShoppingCart} size="1x"/>
                </button>
                <h4>{passedMovie["title"]}</h4>
            </div>
        )
    };

    getMidSlideShow = (passedMovie) => {
        return (
            <div key={passedMovie["movie_id"]} className="slide"
                 style={{transform: "translateX(" + this.state.midX + "%)"}}>
                <img src={basicMovieUrl + passedMovie["backdrop_path"]}
                     onError={(e) => {
                         e.target.onerror = null;
                         e.target.src = "https://wallpaperaccess.com/full/1561985.jpg"
                     }}/>
                <div className="slideshow-info">
                    <h1>{passedMovie["title"]}</h1>
                    <p>
                        {this.getStarName(passedMovie)} in {passedMovie["title"]}
                        ({passedMovie["year"]})
                    </p>
                </div>
            </div>
        )
    };

    getStarSlideShow = (passedMovie) => {
        return (
            <div key={passedMovie["movie_id"]} className="slide"
                 style={{transform: "translateX(" + this.state.starX + "%)"}}>
                <img src={basicStarUrl + this.getStarPath(passedMovie)}
                     onError={(e) => {
                         e.target.onerror = null;
                         e.target.src = "https://wallpaperaccess.com/full/1561985.jpg"
                     }}/>
                <div className="slideshow-info">
                    <h1>{this.getStarName(passedMovie)}</h1>
                    <p>
                        {passedMovie["title"]}({passedMovie["year"]})
                    </p>
                </div>
            </div>
        )
    };

    goLeft = ({target}) => {
        const {name} = target;
        console.log(name);
        this.state[name] === 0 ?
            this.setState(() => {
                if (name === "midX") {
                    return {
                        [name]: -100 * (this.state.midPageSlide.length - 1)
                    }
                } else {
                    return {
                        [name]: -100 * (this.state.starPage.length - 1)
                    }
                }
            }) :
            this.setState((prevState) => {
                return {
                    [name]: prevState[name] + 100
                };
            })
    };

    goRight = ({target}) => {
        const {name} = target;
        if (name === "midX") {
            this.state[name] <= -100 * (this.state.midPageSlide.length - 1) ?
                this.setState({[name]: 0}) :
                this.setState((prevState) => {
                    return {
                        [name]: prevState[name] - 103.5
                    };
                })
        } else {
            this.state[name] === -100 * (this.state.starPage.length - 1) ?
                this.setState({[name]: 0}) :
                this.setState((prevState) => {
                    return {
                        [name]: prevState[name] - 100
                    };
                })
        }


    };

    //
    // createGenreMap (){
    //     let map = new Map();
    //     map.set("1", "Action");
    //     map.set("2", "Adventure");
    //     map.set("3", "Animation");
    //     map.set("4", "Comedy");
    //     map.set("5", "Crime");
    //     map.set("6", "Documentary");
    //     map.set("7", "Drama");
    //     map.set("8", "Family");
    //     map.set("9", "Fantasy");
    //     map.set("10", "History");
    //     map.set("11", "Horror");
    //     map.set("12", "Music");
    //     map.set("13", "Mystery");
    //     map.set("14", "Romance");
    //     map.set("15", "Science Fiction");
    //     map.set("16", "TV Movie");
    //     map.set("17", "Thriller");
    //     map.set("18", "War");
    //     map.set("19", "Western");
    //     return map;
    // };


    getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    };

    setupHomePage(passedMovies, homeGenre) {
        const len = passedMovies.length;
        let slideShowTimer = setInterval(this.next, 20000);
        this.setState({
            rawMovies: passedMovies,
            frontPage: passedMovies[0],
            midPageSlide: passedMovies.slice(1, len / 2),
            starPage: passedMovies.slice((len / 2) + 1, len),
            timer: slideShowTimer,
            homeGenre: homeGenre
        })
    }

    cartClick = (movie_id) => {
        console.log("Cart button clicked: " + movie_id);
        Billing.cartInsert(localStorage.getItem("email"), movie_id, 1)
            .then(response => {
                this.handleCartInsertResponse(response);
            })
            .catch(error => {
                console.log(error);
                this.props.history.push("/servererror");
            })
    };

    componentDidMount() {
        let map = new Map();
        map.set("1", "Action");
        map.set("2", "Adventure");
        map.set("3", "Animation");
        map.set("4", "Comedy");
        map.set("5", "Crime");
        map.set("6", "Documentary");
        map.set("7", "Drama");
        map.set("8", "Family");
        map.set("9", "Fantasy");
        map.set("10", "History");
        map.set("11", "Horror");
        map.set("12", "Music");
        map.set("13", "Mystery");
        map.set("14", "Romance");
        map.set("15", "Science Fiction");
        map.set("16", "TV Movie");
        map.set("17", "Thriller");
        map.set("18", "War");
        map.set("19", "Western");
        let homeGenre = map.get("" + this.getRandomInt(1, 20));

        const {handleFirstVisit} = this.props;
        let firstVisit = JSON.parse(localStorage.getItem("firstVisit"));


        console.log(this.state);
        console.log(localStorage);


        if (firstVisit) {
            // console.log(map.get("5"));
            Movie.basicSearch("?genre=" + homeGenre + "&limit=25")
                .then(response => {
                    console.log("Response:");
                    console.log(response);
                    switch (response["data"]["resultCode"]) {
                        case 210:
                            //THERE WAS A BIG ERROR HERE: i put handlefirstvisit first and then setupHomePage, but since
                            //HFV sets the state of content, it forcefully reloads the page while I try to change the state of
                            //home which is now unmounted because of HFV. ORDERING MATTERS
                            console.log("IN 219");
                            this.setupHomePage(response["data"]["movies"], homeGenre);
                            handleFirstVisit(response);
                            break;
                        default:
                            console.log("In default of home page componentDidMount");
                            this.props.handleLogOut();
                            break;
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.props.history.push("/servererror")
                });
        } else {
            // console.log(map.get("5"));
            console.log("In the else of Home componentDidMount");
            console.log(this.state);
            //todo we might already homeGenre in state, so no need to give new homeGenre
            this.setupHomePage(JSON.parse(localStorage.getItem("movies")), homeGenre);
        }

    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }


    render() {
        console.log(this.state);
        const {rawMovies, frontPage} = this.state;
        let year = frontPage["year"] ? frontPage["year"] : "";
        let director = frontPage["director"] ? frontPage["director"] : "";
        let rating = frontPage["rating"] ? frontPage["rating"] : "";
        return (
            <div className="wrapper">
                {
                    (rawMovies.length === 0) &&
                    <h1>FETCHING YOUR HOME PAGE</h1>
                }

                {
                    (rawMovies.length !== 0) &&
                    <div className="home-page">
                        <h1>Home</h1>
                        {
                            frontPage &&
                            <Fragment>
                                <div className="front-screen">
                                    <img className="front-screen-background"
                                         src={basicMovieUrl + frontPage["backdrop_path"]}
                                         onError={(e) => {
                                             e.target.onerror = null;
                                             e.target.src = "https://wallpaperaccess.com/full/1561985.jpg"
                                         }}/>
                                    <img className="front-screen-pic" src={basicMovieUrl + frontPage["poster_path"]}
                                         onError={(e) => {
                                             e.target.onerror = null;
                                             e.target.src = "https://wallpaperaccess.com/full/1561985.jpg"
                                         }}/>
                                    <div className="front-screen-info">
                                        <h1> {frontPage["title"]}</h1>
                                        <div className="button-holder">
                                            <button
                                                onClick={() => {
                                                    this.cartClick(frontPage["movie_id"])
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faShoppingCart} size="2x"/>Add to Cart
                                            </button>
                                            <button
                                                onClick={() => {
                                                    this.infoClick(frontPage["movie_id"])
                                                }}>
                                                <FontAwesomeIcon icon={faSearch} size="2x"/>More Info
                                            </button>
                                        </div>
                                        <div className="extra-info">
                                            {year && <div className="mini-info"><h1>Year</h1><h4>{year}</h4></div>}
                                            {director &&
                                            <div className="mini-info"><h1>Director</h1><h4>{director}</h4></div>}
                                            {rating &&
                                            <div className="mini-info"><h1>Rating</h1><h4>{rating}</h4></div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="trending-scroller">
                                    <h2>Hot {this.state.homeGenre} Movies</h2>
                                    <div className="scroller-container">
                                        {this.state.rawMovies.map(this.getWhatsTrendingIn)}
                                        <button id="go-right1" className="slide-button" onClick={this.goRight}
                                                name="midX">
                                            <FontAwesomeIcon icon={faChevronRight} size="2x"/>
                                        </button>
                                    </div>
                                </div>
                                {/*<div className="thumbnail-slider">*/}
                                {/*    {midPageSlide.map(this.getMidSlideShow)}*/}
                                {/*    <button id="go-left1" className="slide-button" onClick={this.goLeft} name="midX">*/}
                                {/*        <FontAwesomeIcon icon={faChevronLeft} size="2x"/>*/}
                                {/*    </button>*/}
                                {/*    <button id="go-right1" className="slide-button" onClick={this.goRight} name="midX">*/}
                                {/*        <FontAwesomeIcon icon={faChevronRight} size="2x"/>*/}
                                {/*    </button>*/}
                                {/*</div>*/}
                                {/*<h1 id="weekly-stars">Weekly Stars</h1>*/}
                                {/*<div className="thumbnail-star-slider">*/}
                                {/*    {starPage.map(this.getStarSlideShow)}*/}
                                {/*    <button id="go-left2" className="slide-button" onClick={this.goLeft} name="starX">*/}
                                {/*        <FontAwesomeIcon icon={faChevronLeft} size="2x"/>*/}
                                {/*    </button>*/}
                                {/*    <button id="go-right2" className="slide-button" onClick={this.goRight} name="starX">*/}
                                {/*        <FontAwesomeIcon icon={faChevronRight} size="2x"/>*/}
                                {/*    </button>*/}
                                {/*</div>*/}

                                {/*todo then work on search bar in navbar */}
                                {/*todo then work on functionality of the search bar*/}
                                {/*todo finish up bottom portion of the home page*/}


                                {/*<div className="thumbnail-star">*/}
                                {/*    <img src={basicStarUrl + this.getStarPath(starPage[starIndex])} alt=""/>*/}
                                {/*    <p>{this.getStarName(starPage[starIndex])}</p>*/}
                                {/*</div>*/}
                            </Fragment>
                        }
                        <div className="footer">
                            <div className="quick-links">
                                <Link to="/home">
                                    Home
                                </Link>
                                <Link to="/">
                                    About Fabflix
                                </Link>
                                <Link to="/register">
                                    Register an Account
                                </Link>
                                <Link to="/">
                                    Checkout
                                </Link>
                                <Link to="/">
                                    Privacy Policy
                                </Link>
                            </div>
                            <div className="copyright">
                                <p>Copyright <FontAwesomeIcon icon={faCopyright}/> 2020 by Luis(Lewis) Escobar. All
                                    rights reserved.</p>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Home;
