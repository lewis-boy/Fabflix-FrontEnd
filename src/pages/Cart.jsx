import React, {Component, Fragment} from "react";
import Billing from "../services/Billing";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ClipLoader from "react-spinners/ClipLoader";

import "../css/navbar.css";
import "../css/cart.css";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {basicCartMovieUrl} from "../Config";


class Cart extends Component {
    state = {
        cartMovies: [],
        cartError: "",
        cartTotal: 0
    };

    handleCartResponse = (response) => {
        switch (response["data"]["resultCode"]) {
            case 312:
                this.setState({cartMovies: []});
                break;
            case 3130:
                this.updateCartMovies(response);
                break;
            default:
                this.setState({cartError: "Operation could be fulfilled"});
                break;
        }
    };

    handleDeleteResponse = (response) => {
        switch (response["data"]["resultCode"]) {
            case 312:
                this.setState({cartError: "Error occurred when trying to delete movie. Does not exist"});
                break;
            case 3120:
                this.props.history.push("billing/cart/delete");
                break;
            default:
                this.setState({cartError: "Operation could be fulfilled"});
                break;
        }
    };

    handleUpdateResponse = (response) => {
        switch (response["data"]["resultCode"]) {
            case 312:
                this.setState({cartError: "Could not update cart due to non-existant"});
                break;
            case 3120:
                this.props.history.push("billing/cart/update");
                break;
            default:
                this.setState({cartError: "Operation could be fulfilled"});
                break;
        }
    };

    handleOrderPlaceResponse = (response) => {
        switch(response["data"]["resultCode"]){
            case 3400:
                console.log("test 1")
                window.location.assign(response["data"]["approve_url"]);
                console.log("bonus test")
                break;
            default:
                break;
        }
    };

    updateCartMovies = (response) => {
        //update this.state.cartMovies and wrap mapping in a gallery wrapper
        let mappedCart;
        mappedCart = <div className="cart-gallery">{response["data"]["items"].map(this.createCartItem)}</div>
        this.setState({
            cartMovies: mappedCart
        });
    };

    createCartItem = (item) => {
        //create one cart item and use this for mapping
        let stateName = item["movie_title"];
        let unit_price = item["unit_price"];
        let quantity = item["quantity"];
        let subTotal = unit_price * quantity;
        this.setState((prevState) => {
            return {
                cartTotal: prevState.cartTotal + subTotal
            };
        });
        return (
            <div className="item-wrapper">
                <div className="movie-poster-holder">
                    <img src={basicCartMovieUrl + item.poster_path} alt=""/>
                    <p>{item["movie_title"]}</p>
                </div>
                <div className="editing-holder">
                    <div className="quantity-editing-holder">
                        <span className="cart-info-span">${unit_price}</span>
                        <div >
                            <input
                                size="2"
                                maxLength="2"
                                className="quantity-bar"
                                type="search"
                                name={stateName}
                                value={quantity}
                                onChange={this.updateField}>
                            </input>
                            <button className="update-button"
                                    onClick={() => {
                                        this.handleUpdateClick(stateName)
                                    }}>Update
                            </button>
                        </div>
                        <span className="cart-info-span">${subTotal}</span>
                        <button className="trash-button"
                                onClick={() => {
                                    this.handleRemoveClick(stateName)
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
        this.setState({[name]: value});
    };

    handleUpdateClick = (stateName) => {
        //might be an implicit delete, so send over movie_id, email, and quantity
        if (this.state[stateName] === "" || this.state[stateName] === 0) {
            Billing.cartDelete(localStorage.getItem("email"), stateName)
                .then(response => {
                    this.handleDeleteResponse(response)
                })
                .catch(error => {
                    this.props.history.push("/servererror")
                })
        } else if (this.state[stateName] > 0) {
            Billing.cartUpdate(localStorage.getItem("email"), stateName, this.state[stateName])
                .then(response => {
                    this.handleUpdateResponse(response);
                })
                .catch(error => {
                    this.props.history.push("/servererror")
                })
        } else {
            console.log("Something weird happened in handleUpdateClick\n" + "this.state[statename]: " + this.state[stateName]);
        }
    };

    //stateName = itemName
    handleRemoveClick = (stateName) => {
        //send over movie_id and email
        Billing.cartDelete(localStorage.getItem("email"), stateName)
            .then(response => {
                this.handleDeleteResponse(response);
            })
            .catch(error => {
                this.props.history.push("/servererror")
            })
    };

    handleCheckoutClick = () => {
        Billing.orderPlace(localStorage.getItem("email"))
            .then( response => {
                this.handleOrderPlaceResponse(response);
            })
            .catch( error => {
                    this.props.history.push("/servererror")
                }
            )
    };

    componentDidMount() {
        Billing.cartRetrieve(localStorage.getItem("email"))
            .then(response => {
                this.handleCartResponse(response);
            })
            .catch(error => {
                this.props.history.push("/servererror")
            })
    }

    render() {
        //TODO abandon the fixed div and follow kelloggs version on the side

        const {cartMovies, cartTotal} = this.state;
        return (
            <div className="wrapper">
                {(cartMovies.length === 0) &&
                <Fragment><h1>FETCHING YOUR CART</h1>
                    <ClipLoader
                        size={130}
                        color={"#FF0000"}
                        loading={cartMovies.length === 0}
                    />
                </Fragment>}
                {(cartMovies.length !== 0) &&
                //TODO add buttons below cartMovies map
                <Fragment>
                    <div className="flex">
                        <span className="shopping-cart-title">Shopping Cart</span>
                    </div>
                    <div className="column-titles">
                        <span className="price">Price</span>
                        <span className="qty">Qty</span>
                        <span className="subtotal">Subtotal</span>
                    </div>
                    <div className="main-content">
                        {cartMovies}
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
                            <button className="checkout-button" onClick={this.handleCheckoutClick}>Proceed to Checkout</button>
                        </div>
                    </div>
                </Fragment>}
            </div>
        );
    }
}

export default Cart;


