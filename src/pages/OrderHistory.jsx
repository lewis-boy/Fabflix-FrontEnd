import React, {Component, Fragment} from "react";
import Billing from "../services/Billing";
import Movie from "../services/Movie";

import {} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import "../css/orderHistory.css";
import {basicCartMovieUrl} from "../Config";
import ClipLoader from "react-spinners/ClipLoader";

class OrderHistory extends Component {
    state = {
        history: [],
        allMovieIds: [],
        posterMap: [[]]
    };

    componentDidMount() {
        Billing.orderRetrieve(localStorage.getItem("email"))
            .then(response => {
                this.handleRetrieveResponse(response);
            })
            .catch(error => {
                    console.log(error);
                    this.props.history.push("/servererror")
                }
            )
    }

    //todo Make promises in order to make setState work. Look up promises
    handleRetrieveResponse = (transactionResponse) => {
        switch (transactionResponse["data"]["resultCode"]) {
            case 3410:
                this.getAllMovieIdsFromResponse(transactionResponse["data"]);
                Movie.thumbnail(this.state.allMovieIds)
                    .then(thumbnailResponse => {
                        this.handleThumbnailResponse(thumbnailResponse);
                        this.updateOrderHistory(transactionResponse);
                    })
                    .catch(error => {
                            console.log(error);
                            this.props.history.push("/servererror")
                        }
                    );
                break;
            default:
                break;
        }
    };

    getAllMovieIdsFromResponse = (data) => {
        let arrayOfIds = [];
        data["transactions"].forEach(function (transaction) {
            let newArray = transaction["items"].map(item => item["movie_id"]);
            arrayOfIds = arrayOfIds.concat(newArray);
        });
        console.log(arrayOfIds);
        this.setState({
            allMovieIds: arrayOfIds
        })
    };

    handleThumbnailResponse = (response) => {
        let map = new Map();
        switch (response["data"]["resultCode"]) {
            case 210:
                response["data"]["thumbnails"].forEach(function (thumbnail) {
                    map.set(thumbnail["movie_id"], thumbnail["poster_path"])
                });
                this.setState({
                    posterMap: map
                });
                break;
            default:
                break;
        }
    };

    updateOrderHistory = (response) => {
        let mappedHistory;
        mappedHistory =
            <div className="history-gallery">{response["data"]["transactions"].map(this.createHistoryEntry)}</div>;
        this.setState({
            history: mappedHistory
        });
    };

    createHistoryEntry = (transaction) => {
        let total = transaction["amount"]["total"];
        let placedDate = new Date(transaction["create_time"]);
        let movieArray =
            <div className="entire-transaction-holder">
                <div className="transaction-info-holder">
                    <div>
                        <h4>Order Placed:</h4>
                        <h3>{placedDate.getMonth() + "/" + placedDate.getDay() + "/" + placedDate.getFullYear()}</h3>
                    </div>
                    <div>
                        <h2>Order Total: </h2><h2>${total}</h2>
                    </div>
                </div>
                <div className="history-movie-gallery">
                    {transaction["items"].map(this.createMovieItem)}
                </div>
            </div>;
        return (movieArray)
    };

    //todo make another api call to get all thumbnails and then make a map for O(1) lookup
    //todo STEP 1: get the ids of all movies and put them into an array
    //todo STEP 2: send an API call to get thumbnails
    //todo STEP 3: map each thumbnail movie id : poster path and save map to state
    //todo STEP 4: go back to normal work flow and create the page

    createMovieItem = (movie) => {
        let quantity = movie["quantity"];
        let id = movie["movie_id"];
        console.log("This is MAP testing:");
        console.log(this.state.posterMap);

        let movieItem =
            <div className="movie-item">
                <img src={basicCartMovieUrl + this.state.posterMap.get(id)}
                     onError={(e)=>{e.target.onerror = null; e.target.src="https://via.placeholder.com/150"}}/>
                <h2>X{quantity}</h2>
            </div>;
        return (movieItem);
    };

    render() {
        const {history} = this.state;
        return (
            <div className="wrapper">
                {(history.length === 0) &&
                <Fragment><h1>FETCHING YOUR HISTORY</h1>
                    <ClipLoader
                        size={130}
                        color={"#FF0000"}
                        loading={history.length === 0}
                    />
                </Fragment>}
                {(history.length !== 0) &&
                    <Fragment>
                        <h1 className="page-title">Your Orders</h1>
                        {history}
                    </Fragment>
                }
            </div>
        )
    }
}

export default OrderHistory;