import React, {Component, Fragment} from "react";
import Billing from "../services/Billing";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ClipLoader from "react-spinners/ClipLoader";

import "../css/navbar.css";
import "../css/cart.css";
import "../css/universal.css";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {basicCartMovieUrl} from "../Config";


class Cart extends Component {
    state = {
        rawCartMovies:[],
        cartError: "",
        isMounted: false,
        movieIds: []
    };

    handleCartRetrieveResponse = (response) => {
        switch (response["data"]["resultCode"]) {
            case 312:
            case 3150:
                this.setState({rawCartMovies: []});
                break;
            case 3130:
                this.updateCartMovies(response);
                break;
            default:
                this.setState({cartError: "BadRequest Error"});
                break;
        }
    };

    handleDeleteResponse = (response, movie_id) => {
        switch (response["data"]["resultCode"]) {
            case 312:
            case 3150:
                this.setState({cartError: response["data"]["message"]});
                break;
            case 3120:
                this.setState((prevState) => {
                    return {
                        rawCartMovies: prevState.rawCartMovies.filter(item => item.movie_id !== movie_id)
                    };
                });
                break;
            default:
                this.setState({cartError: "BadRequest Error"});
                break;
        }
    };

    handleUpdateResponse = (response, movie_id, quantity) => {
        switch (response["data"]["resultCode"]) {
            case 33:
            case 312:
            case 3150:
                this.setState({cartError: response["data"]["message"]});
                break;
            case 3110:
                console.log(this.state);
                this.setState((prevState) => {
                    return {
                        [movie_id]: quantity,
                        [movie_id + "Changed"]: true
                    }
                });
                console.log(this.state);
                break;
            default:
                this.setState({cartError: "BadRequest Error"});
                break;
        }
    };

    handleOrderPlaceResponse = (response) => {
        switch (response["data"]["resultCode"]) {
            case 3400:
                //console.log("test 1");
                window.location.assign(response["data"]["approve_url"]);
                //console.log("bonus test");
                break;
            default:
                this.setState({cartError: "BadRequest Error"});
                break;
        }
    };

    handleClearCartResponse = (response) => {
        switch (response["data"]["resultCode"]) {
            case 312:
            case 3150:
                this.setState({cartError: response["data"]["message"]});
                break;
            case 3140:
                this.setState({
                    rawCartMovies: [],
                    cartMessage: "Your Cart is Empty"
                });
                break;
            default:
                this.setState({cartError: "BadRequest Error"});
                break;
        }
    };

    updateCartMovies = (response) => {
        //update this.state.cartMovies and wrap mapping in a gallery wrapper
        let mappedIds;
        mappedIds = response["data"]["items"].map( item => item["movie_id"]);

        response["data"]["items"].forEach( (item) => {
            this.setState({
                    [item["movie_id"]]: item["quantity"],
                    [item["movie_id"] + "Price"]: item["unit_price"]});
        });
        this.setState({
            rawCartMovies: response["data"]["items"],
            movieIds: mappedIds
        });
        //console.log(this.state);
    };

    createCartItem = (item) => {
        //create one cart item and use this for mapping
        let unit_price = item["unit_price"];
        let quantity = item["quantity"];
        let movie_id = item["movie_id"];

        return (
            <div className="item-wrapper" key={movie_id}>
                <div className="movie-poster-holder">
                    <img src={basicCartMovieUrl + item.poster_path}
                         onError={(e)=>{e.target.onerror = null; e.target.src="https://via.placeholder.com/150"}}/>
                    <p>{item["movie_title"]}</p>
                </div>
                <div className="editing-holder">
                    <div className="quantity-editing-holder">
                        <span className="cart-info-span">${unit_price}</span>
                        <div className="flex-column">
                            <input
                                size="2"
                                maxLength="3"
                                className="quantity-bar"
                                type="search"
                                name={movie_id}
                                defaultValue={quantity}
                                onChange={this.updateField}
                            >
                            </input>
                            <button className="update-button"
                                    onClick={() => {
                                        this.handleUpdateClick(movie_id)
                                    }}>Update
                            </button>
                            <div className={"update-message" + (this.state[movie_id + "Changed"] ? "" : " hide")}>
                                Your cart has been updated!
                            </div>
                        </div>
                        <span className="cart-info-span">${(this.state[movie_id + "Price"] * this.state[movie_id])}</span>
                        <button className="trash-button"
                                onClick={() => {
                                    this.handleRemoveClick(movie_id)
                                }}>
                            <FontAwesomeIcon icon={faTrashAlt} size="lg"/>
                        </button>
                    </div>
                </div>


            </div>
        );
    };

    updateField = ({target}) => {
        const {name, value} = target;
        this.setState({
            [name]: value,
            [name + "Changed"]: false,
            cartError: ""
        });
    };

    handleUpdateClick = (movie_id) => {
        let quantity = this.state[movie_id];
        // console.log("Movie id: " + movie_id);
        // console.log("Quantity: " + quantity);
        //Nevermind, quantity must be greater than 0, which means just display error message
        Billing.cartUpdate(localStorage.getItem("email"), movie_id, quantity)
            .then(response => {
                this.handleUpdateResponse(response, movie_id, quantity);
            })
            .catch(error => {
                this.props.history.push("/servererror")
            })
    };

    //stateName = itemName
    handleRemoveClick = (movie_id) => {
        //send over movie_id and email
        Billing.cartDelete(localStorage.getItem("email"), movie_id)
            .then(response => {
                this.handleDeleteResponse(response, movie_id);
            })
            .catch(error => {
                this.props.history.push("/servererror")
            })
    };

    handleClearCLick = () => {
        Billing.cartClear(localStorage.getItem("email"))
            .then(response => {
                this.handleClearCartResponse(response);
            })
            .catch(error => {
                this.props.history.push("/servererror")
            })
    };

    handleCheckoutClick = () => {
        Billing.orderPlace(localStorage.getItem("email"))
            .then(response => {
                this.handleOrderPlaceResponse(response);
            })
            .catch(error => {
                    this.props.history.push("/servererror")
                }
            )
    };

    componentDidMount() {
        console.log("Cart Mounted");
        Billing.cartRetrieve(localStorage.getItem("email"))
            .then(response => {
                this.handleCartRetrieveResponse(response);
                this.setState({
                    isMounted: true
                })
            })
            .catch(error => {
                console.log(error);
                this.props.history.push("/servererror")
            })
    }

    render() {

        const {rawCartMovies, cartError, isMounted} = this.state;
        let cartTotal = 0;
        let errorHide = cartError ? "" : " hide";
        this.state["movieIds"].forEach( (movie_id) => {
            cartTotal += this.state[movie_id + "Price"] * this.state[movie_id];
        });

        return (
            <div className="wrapper">
                {(rawCartMovies.length === 0) && (!isMounted) &&
                <Fragment><h1>FETCHING YOUR CART</h1>
                    <ClipLoader
                        size={130}
                        color={"#FF0000"}
                        loading={rawCartMovies.length === 0}
                    />
                </Fragment>}

                {/*//todo handle error messages here*/}
                {(rawCartMovies.length === 0) && (isMounted) &&
                <Fragment>
                    <h1>{cartError}</h1>
                    <div className="footer-buttons">
                        <button className="continue-button" onClick={this.props.history.goBack}>Continue Shopping
                        </button>
                    </div>
                </Fragment>}


                {(rawCartMovies.length !== 0) &&
                <Fragment>
                    <div className={"basic-error-message" + errorHide}>
                        {cartError}
                    </div>
                    <div className="flex">
                        <span className="shopping-cart-title">Shopping Cart</span>
                    </div>
                    <div className="column-titles">
                        <span className="price">Price</span>
                        <span className="qty">Qty</span>
                        <span className="subtotal">Subtotal</span>
                    </div>
                    <div className="main-content" onClick={console.log(this.state)}>
                        <div className="left-side">
                            <div className="cart-gallery">{rawCartMovies.map(this.createCartItem)}</div>;
                            <div className="footer-buttons">
                                <button className="clear-button" onClick={this.handleClearCLick}>Clear Cart</button>
                                <button className="continue-button" onClick={this.props.history.goBack}>Continue
                                    Shopping
                                </button>
                            </div>
                        </div>
                        <div className="checkout-box">
                            <div className="group">
                                <h3 className="field">Redeem or Coupon Code</h3>
                                <input
                                    maxLength="2"
                                    className="coupon-bar"
                                    type="search"
                                    name="coupon"
                                    onChange={this.updateField}>
                                </input> <span className="apply">APPLY</span>
                            </div>
                            <div className="group">
                                <h3 className="field">FREE Shipping</h3>
                                <span>Get FREE Shipping on orders of $1,000 or more</span>
                            </div>
                            <div className="group">
                                <div className="field total">
                                    <h3>Subtotal</h3>
                                    <h3>${cartTotal.toFixed(2)}</h3>
                                </div>
                                <div className="total">
                                    <h2>Grand Total</h2>
                                    <h2>${cartTotal.toFixed(2)}</h2>
                                </div>
                            </div>
                            <button className="checkout-button" onClick={this.handleCheckoutClick}>Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </Fragment>}
            </div>
        );
    }
}

export default Cart;


