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
        rawResponse: "",
        quantity: 1
    };


    componentDidMount() {
        console.log("In  mounting");
        console.log(this.props.match.params);
        console.log(this.props.location.search);

        switch (this.props.match.path) {
            case "/movies/get/:movie_id":
                console.log("In movies id get");
                Movie.movieIdSearch(this.props.match.params.movie_id)
                    .then(response => {
                        switch (response["data"]["resultCode"]) {
                            case 210:
                                this.setState(
                                    {rawResponse: response["data"]["movie"]}
                                );
                                break;
                            case 211:
                                this.setState(
                                    {rawResponse: "empty"});
                                break;
                            default:
                                this.setState({rawResponse: ""});
                                break;
                        }
                    })
                    .catch(error => {
                        this.props.history.push("/servererror");
                    });
                break;

            case "/movies/people/get/:person_id":
                console.log("In person id get");
                Movie.detailedPeopleSearch(this.props.match.params.person_id)
                    .then(response => {
                        switch (response["data"]["resultCode"]) {
                            case 212:
                                this.setState(
                                    {rawResponse: response["data"]["person"]}
                                );
                                break;
                            case 213:
                                this.setState(
                                    {rawResponse: "empty"});
                                break;
                            default:
                                this.setState({rawResponse: ""});
                                break;
                        }
                    });
                break;
            default:
                break;
        }


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
        <NavLink key={person.person_id} to={("/movies/people/get/" + person["person_id"])}>
            {person["name"]}
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

    createMovie = () => {
        const {rawResponse, quantity} = this.state;
        let overview = (rawResponse.overview ? rawResponse.overview : "No overview available");
        let director = (rawResponse.director ? rawResponse.director : "No director available");
        let starring = (rawResponse.people ? this.splitStars(rawResponse.people) : "No stars available");
        let genres = (rawResponse.genres ? this.splitGenres(rawResponse.genres) : "No genres available");
        let budget = (rawResponse.budget ? rawResponse.budget : "No budget provided");
        let revenue = (rawResponse.revenue ? rawResponse.revenue : "No revenue provided");
        let rating = (rawResponse.rating ? rawResponse.rating : "No rating provided");
        let ratingColor;
        if(rating <= 4.0)
            ratingColor = "red";
        else if(rating > 4.0 && rating < 7.0)
            ratingColor = "goldenrod";
        else if(rating >= 7.0)
            ratingColor = "green";
      return(
          <div className="movie-holder">
              <h1>{rawResponse.title}</h1>
              {/*style={{backgroundImage: "url(" + backdropMovieUrl + movie.backdrop_path + ")"}}*/}
              <div className="movie-info" style={{backgroundImage: "linear-gradient(to right, rgba(0,0,0,1.0) 30%, rgba(0,0,0,0.1)), " +
                      "url(" + backdropMovieUrl + rawResponse.backdrop_path + ")"}}>
                  <div className="poster-holder">
                      <img src={basicThumbnailMovieUrl + rawResponse.poster_path}
                           onError={(e)=>{e.target.onerror = null;
                           e.target.src="https://catalog.osaarchivum.org/assets/thumbnail_placeholder_movie-480596e192e7043677f77cf78b13bdd1.jpg"}}/>
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
                              this.cartClick(rawResponse.movie_id)
                          }}>
                              <FontAwesomeIcon icon={faShoppingCart} size="1x"/>Add to Cart
                          </button>
                          <button className="rate-button" name="up" onClick={() => {
                              this.rateClick(rawResponse.movie_id)
                          }}>
                              <FontAwesomeIcon icon={faThumbsUp} size="1x"/>
                          </button>
                          <button className="rate-button" name="down" onClick={() => {
                              this.rateClick(rawResponse.movie_id)
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
      )
    };

    createPerson = () => {
        const {rawResponse, quantity} = this.state;
        let biography = (rawResponse.biography ? rawResponse.biography : "No biography available");
        let gender = (rawResponse.gender ? rawResponse.gender : "No gender available");
        let birthday = (rawResponse.birthday ? rawResponse.birthday : "No birthday available");
        let birthplace = (rawResponse.birthplace ? rawResponse.birthplace : "No birthplace available");
        let popularity = (rawResponse.popularity ? rawResponse.popularity : "No popularity provided");
        return(
            <div className="movie-holder">
                <h1>{rawResponse.name}</h1>
                {/*style={{backgroundImage: "url(" + backdropMovieUrl + movie.backdrop_path + ")"}}*/}
                <div className="movie-info" style={{backgroundImage: "black"}}>
                    <div className="poster-holder">
                        <img src={basicThumbnailMovieUrl + rawResponse.poster_path}
                             onError={(e)=>{e.target.onerror = null;
                                 e.target.src="https://catalog.osaarchivum.org/assets/thumbnail_placeholder_movie-480596e192e7043677f77cf78b13bdd1.jpg"}}/>
                    </div>
                    <div className="details">
                        <div className="inline">
                            <h3>Biography:</h3> <p>{biography}</p>
                        </div>
                        <div className="inline">
                            <h3>Gender:</h3> <p>{gender}</p>
                        </div>
                        <div className="inline">
                            <h3>Birthday:</h3><p>{birthday}</p>
                        </div>
                        <div className="inline">
                            <h3>BirthPlace:</h3><p>{birthplace}</p>
                        </div>
                        <div className="inline">
                            <h3>popularity:</h3> <p>{popularity.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        )

    };


    render() {
        const {rawResponse, quantity} = this.state;
        const {movie_id} = this.props.match.params;



        //todo make a rateClick function that does nothing
        //todo bring in the star rating and make it reflect its rating - look up video


        return (
            <div className="wrapper">


                {(rawResponse === "") &&
                <Fragment>
                    <h1>FETCHING YOUR MOVIE/PERSON</h1>
                    <ClipLoader
                        size={150}
                        color={"#FF0000"}
                        loading={rawResponse === ""}
                    />
                </Fragment>}


                {(rawResponse === "empty") &&
                <Fragment>
                    <h1>No Movie/Person was found with Id: {movie_id}</h1>
                </Fragment>
                }


                {(rawResponse !== "" && rawResponse !== "empty") && <Fragment>
                    {rawResponse["movie_id"] && this.createMovie()}
                    {rawResponse["person_id"] && this.createPerson()}
                </Fragment>}
            </div>
        );

    }
}

export default OneMovie;