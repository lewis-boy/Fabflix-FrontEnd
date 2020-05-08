import React, {Component, Fragment} from "react";


import "../css/home.css";
import "../css/common.css";

import Movie from "../services/Movie";
import {basicMovieUrl, basicStarUrl} from "../Config.json";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faChevronLeft,
    faChevronRight,
    faCopyright,
} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";


class Home extends Component {
    state = {
        movies: [],
        frontPage: "",
        midPageSlide: [],
        midX: 0,
        starPage: [],
        starX: 0,
        timer: ""
    };

    setupHomePage(passedMovies) {
        const len = passedMovies.length;
        let slideShowTimer = setInterval(this.next, 20000);
        this.setState({
            movies: passedMovies,
            frontPage: passedMovies[0],
            midPageSlide: passedMovies.slice(1, len / 2),
            starPage: passedMovies.slice((len / 2) + 1, len),
            timer: slideShowTimer
        })
    }

    getStarName(passedMovie) {
        if(passedMovie === undefined)
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

    getMidSlideShow = (passedMovie) => {
        return (
            <div key={passedMovie["movie_id"]} className="slide"
                 style={{transform: "translateX(" + this.state.midX + "%)"}}>
                <img src={basicMovieUrl + passedMovie["backdrop_path"]} alt=""/>
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
                <img src={basicStarUrl + this.getStarPath(passedMovie)} alt=""/>
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
            this.state[name] === -100 * (this.state.midPageSlide.length - 1) ?
                this.setState({[name]: 0}) :
                this.setState((prevState) => {
                    return {
                        [name]: prevState[name] - 100
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

    //todo USE AXIOS CANCEL TOKEN TO END API CALLS WHEN NAVIGATION OCCURS

    componentDidMount() {
        //                            alert(homePageMovies.length);
        console.log("Home mounted");
        const {handleFirstVisit} = this.props;
        let firstVisit = JSON.parse(localStorage.getItem("firstVisit"));


        let map = new Map();
        map.set("t100", "forgiven");
        map.set("t200", "jail");
        map.set("t300", "land");
        map.set("t100", "forgiven");
        map.set("t400", "blue");
        map.set("t500", "sun");
        map.set("t300", "land");
        console.log(map);


        //500's caught by the .catch
        //everything else handles by default
        if (firstVisit) {
            Movie.getRandomMovies()
                .then(response => {
                    switch (response["data"]["resultCode"]) {
                        case 219:
                            //THERE WAS A BIG ERROR HERE: i put handlefirstvisit first and then setupHomePage, but since
                            //HFV sets the state of content, it forcefully reloads the page while I try to change the state of
                            //home which is now unmounted because of HFV. ORDERING MATTERS
                            this.setupHomePage(response["data"]["movies"]);
                            handleFirstVisit(response);
                            break;
                        case 218:
                            console.log("In 218 switch of home page componentDidMount");
                            break;
                        default:
                            console.log("In default of home page componentDidMount");
                            this.props.handleLogOut();
                            break;
                    }
                })
                .catch(error => {
                    this.props.history.push("/servererror")
                });
        } else {
            console.log("In the else of Home componentDidMount");
            this.setupHomePage(JSON.parse(localStorage.getItem("movies")));
        }

    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }


    render() {
        const {movies, frontPage, midPageSlide, midX, starPage, starX} = this.state;
        return (
            <div className="wrapper">
                {(movies.length === 0) && <h1>FETCHING YOUR HOME PAGE</h1>}
                {(movies.length !== 0) &&
                <div className="home-page">
                    <h1>Home</h1>
                    {frontPage &&
                    <Fragment>
                        <div className="thumbnail">
                            <img src={basicMovieUrl + frontPage["backdrop_path"]} alt=""/>
                            <div className="movie-info">
                                <p>
                                    {frontPage["title"]}({frontPage["year"]})
                                </p>
                                <p className="star">{this.getStarName(frontPage)}</p>
                            </div>
                        </div>
                        <h1 id="in-theater">In Theater</h1>
                        <div className="thumbnail-slider">
                            {midPageSlide.map(this.getMidSlideShow)}
                            <button id="go-left1" className="slide-button" onClick={this.goLeft} name="midX">
                                <FontAwesomeIcon icon={faChevronLeft} size="2x"/>
                            </button>
                            <button id="go-right1" className="slide-button" onClick={this.goRight} name="midX">
                                <FontAwesomeIcon icon={faChevronRight} size="2x"/>
                            </button>
                        </div>
                        <h1 id="weekly-stars">Weekly Stars</h1>
                        <div className="thumbnail-star-slider">
                            {starPage.map(this.getStarSlideShow)}
                            <button id="go-left2" className="slide-button" onClick={this.goLeft} name="starX">
                                <FontAwesomeIcon icon={faChevronLeft} size="2x"/>
                            </button>
                            <button id="go-right2" className="slide-button" onClick={this.goRight} name="starX">
                                <FontAwesomeIcon icon={faChevronRight} size="2x"/>
                            </button>
                        </div>

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
                            <p>Copyright <FontAwesomeIcon icon={faCopyright} /> 2020 by Luis(Lewis) Escobar. All rights reserved.</p>
                        </div>
                    </div>
                </div>}
            </div>
        );
    }
}

export default Home;
