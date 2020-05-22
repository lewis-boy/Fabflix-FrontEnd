import React, {Component, Fragment} from "react";

import Movie from "../services/Movie";


import "../css/oneMovie.css";

import ClipLoader from "react-spinners/ClipLoader";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShoppingCart, faThumbsUp, faThumbsDown} from "@fortawesome/free-solid-svg-icons";
import {NavLink} from "react-router-dom";
import {backdropMovieUrl, basicThumbnailMovieUrl} from "../Config";

class OneMovie extends Component {
    state = {
        movie: "",
        quantity: 1
    };


    componentDidMount() {
        console.log(this.props.match.params);
        console.log(this.props.location.search);

        Movie.movieIdSearch(this.props.match.params.movie_id)
            .then(response => {
                switch (response["data"]["resultCode"]) {
                    case 210:
                        this.setState(
                            {movie: response["data"]["movie"]}
                        );
                        break;
                    case 211:
                        this.setState(
                            {movie: "empty"});
                        break;
                    default:
                        this.setState({movie: ""});
                        break;
                }
            })
            .catch(error => {
                this.props.history.push("/servererror");
            })
    }

    updateField = ({target}) => {
        const {name, value} = target;
        this.setState({[name]: value});
    };

    rateClick = () => {
        //need to write backend enpoint first
    };

    splitStars = (people) => {
        return (
            <div className="star-list">
                {people.map(this.convertIntoLink).reduce((prev, current) => [prev, ",", current])}
            </div>
        )
    };
    //person object:
    // person_id:
    // name:
    convertIntoLink = (person) => (
        <NavLink key={person.person_id} to={("/movies/people/get/" + person.person_id)}>
            {person.name}
        </NavLink>
    );

    splitGenres = (genres) => (
        <div className="genre-list">
            {genres.map(this.makeGenreList).reduce((prev,current)=>[prev, ",", current])}
        </div>
    );

    makeGenreList = (genre) => (
        <h4 key={genre.genre_id}>
            {genre.name}
        </h4>
    );


    render() {
        const {movie, quantity} = this.state;
        const {movie_id} = this.props.match.params;
        let overview = (movie.overview ? movie.overview : "No overview available");
        let director = (movie.director ? movie.director : "No director available");
        let starring = (movie.people ? this.splitStars(movie.people) : "No stars available");
        let genres = (movie.genres ? this.splitGenres(movie.genres) : "No genres available");
        let budget = (movie.budget ? movie.budget : "No budget provided");
        let revenue = (movie.revenue ? movie.revenue : "No revenue provided");
        let rating = (movie.rating ? movie.rating : "No rating provided");
        let ratingColor;
        if(rating <= 4.0)
            ratingColor = "red";
        else if(rating > 4.0 && rating < 7.0)
            ratingColor = "goldenrod";
        else if(rating >= 7.0)
            ratingColor = "green";



        //todo make a rateClick function that does nothing
        //todo bring in the star rating and make it reflect its rating - look up video


        return (
            <div className="wrapper">


                {(movie === "") &&
                <Fragment>
                    <h1>FETCHING YOUR MOVIE</h1>
                    <ClipLoader
                        size={150}
                        color={"#FF0000"}
                        loading={movie === ""}
                    />
                </Fragment>}


                {(movie === "empty") &&
                <Fragment>
                    <h1>No Movie was found with Id: {movie_id}</h1>
                </Fragment>
                }


                {(movie !== "" && movie !== "empty") && <Fragment>
                    <div className="movie-holder">
                        <h1>{movie.title}</h1>
                        {/*style={{backgroundImage: "url(" + backdropMovieUrl + movie.backdrop_path + ")"}}*/}
                        <div className="movie-info" style={{backgroundImage: "linear-gradient(to right, rgba(0,0,0,1.0) 30%, rgba(0,0,0,0.1)), " +
                                "url(" + backdropMovieUrl + movie.backdrop_path + ")"}}>
                            <div className="poster-holder">
                                <img src={basicThumbnailMovieUrl + movie.poster_path}
                                     onError={(e)=>{e.target.onerror = null; e.target.src="https://via.placeholder.com/150"}}/>
                                <span style={{background: ratingColor}}>{rating}</span>
                            </div>
                            <div className="details">
                                <div className="inline">
                                    <h3>Overview:</h3> <p>{overview}</p>
                                </div>
                                <div className="inline">
                                    <h3>Director:</h3> <p>{director}</p>
                                </div>
                                <div className="add-to-cart">
                                    <input
                                        size="1"
                                        className="quantity-bar"
                                        type="search"
                                        name="quantity"
                                        value={quantity}
                                        onChange={this.updateField}
                                    />
                                    <button className="cart-button" onClick={() => {
                                        this.cartClick(movie.movie_id)
                                    }}>
                                        <FontAwesomeIcon icon={faShoppingCart} size="1x"/>Add to Cart
                                    </button>
                                    <button className="rate-button" name="up" onClick={() => {
                                        this.rateClick(movie.movie_id)
                                    }}>
                                        <FontAwesomeIcon icon={faThumbsUp} size="1x"/>
                                    </button>
                                    <button className="rate-button" name="down" onClick={() => {
                                        this.rateClick(movie.movie_id)
                                    }}>
                                        <FontAwesomeIcon icon={faThumbsDown} size="1x"/>
                                    </button>
                                </div>
                                <div className="inline">
                                    <h3>Starring:</h3><p>{starring}</p>
                                </div>
                                <div className="inline">
                                    <h3>Genres:</h3><p>{genres}</p>
                                </div>
                                <div className="inline">
                                    <h3>Budget:</h3> <p>{budget}</p>
                                </div>
                                <div className="inline">
                                    <h3>Revenue:</h3> <p>{revenue}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>}
            </div>
        );

    }
}

export default OneMovie;