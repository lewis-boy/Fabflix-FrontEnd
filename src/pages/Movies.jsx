import React, { Component } from "react";
import Movie from "../services/Movie.js";
import {httpErrorCheck} from "../util/ErrorChecking";
import TheMovie from "../TheMovie"

class Movies extends Component {
  state = {
    allMovies: ""
  };

  componentDidMount() {
    console.log("Movies mounted")
    let movies;
    Movie.search()
        .then( response => {
          movies = response["data"]["movies"].map( movie => {
            return (
                <TheMovie key={movie.id}
                       title={movie.title}
                       year={movie.year}
                       director={movie.director}
                       rating={movie.rating}
                       backdrop={movie.backdrop_path}
                       poster={movie.poster_path}
                />
            )
          })

          this.setState({
            allMovies: movies
          })

        })
        .catch( error => {
          httpErrorCheck(error);
        })
  }




  render() {
    return (
        <div className="wrapper">
            <div className="movie-gallery">
                {this.state.allMovies}
            </div>
        </div>);
  }
}

export default Movies;
