import React, {Component, Fragment} from "react";


import "../css/home.css";

import Movie from "../services/Movie";
import {httpErrorCheck} from "../util/ErrorChecking";
import {basicMovieUrl} from "../Config.json";

class Home extends Component {
    state = {
        frontPage: "",
        midPageSlide: "",
        midIndex: 0,
        starPage: "",
        starIndex: 0,
        timer: ""
    }

    setupHomePage(passedMovies) {
        const len = passedMovies.length;
        let slideShowTimer = setInterval(this.next,5000);
        this.setState({
            movies: passedMovies,
            frontPage: passedMovies[0],
            midPageSlide: passedMovies.slice(1,len/2),
            starPage: passedMovies.slice((len/2)+1,len),
            timer: slideShowTimer
        })
    }

    next = () => {
        let newMidIndex;
        let newStarIndex;
        this.setState((prevState) => {
            newMidIndex = (prevState.midIndex + 1) >= prevState.midPageSlide.length ? 0 : prevState.midIndex + 1;
            newStarIndex = (prevState.starIndex + 1) >= prevState.starPage.length ? 0 : prevState.starIndex + 1;
            return {
                midIndex: newMidIndex,
                starIndex: newStarIndex
            }
        })
    }

    //new function for carousel
    //maybe store length of array in state?
    //use that length to carousel

    componentDidMount() {
        //                            alert(homePageMovies.length);
        console.log("It mounted");
        const {firstVisit, handleFirstVisit} = this.props;

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
                            //idk yet
                            break;
                        default:
                            break;
                    }
                })
                .catch(error => {
                    httpErrorCheck(error);
                });
        } else
            this.setupHomePage(this.props.homePageMovies);

    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }


    render() {
        const {frontPage, midPageSlide, midIndex, starPage, starIndex} = this.state;
        return (
            <div className="wrapper">
                <div className="home-page">
                    <h1>Home</h1>
                    {frontPage &&
                        <Fragment>
                            <div className="thumbnail">
                                <img src={basicMovieUrl + frontPage["backdrop_path"]} alt=""/>
                                <p>
                                    {frontPage["title"]}({frontPage["year"]})
                                </p>
                            </div>
                            <div className="thumbnail">
                                <img src={basicMovieUrl + midPageSlide[midIndex]["backdrop_path"]} alt=""/>
                                <p>{midPageSlide[midIndex]["title"]}</p>
                                <div className="dot-container">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                            <div className="thumbnail">
                                <img src={basicMovieUrl + starPage[starIndex]["backdrop_path"]} alt=""/>
                                <p>{starPage[starIndex]["title"]}</p>
                            </div>
                        </Fragment>
                    }
                </div>
            </div>
        );
    }
}

export default Home;
