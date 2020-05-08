import React, {Component} from "react";
import Billing from "../services/Billing";

import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import "../css/home.css";
import "../css/complete.css";

class Complete extends Component {
    state = {
        orderComplete: false,
        message: ""
    };

    componentDidMount() {
        //starts with ?
        console.log(this.props.location.search);
        Billing.orderComplete(this.props.location.search)
            .then( response => {
                this.handleCompleteResponse(response);
            })
            .catch( error => {
                this.props.history.push("/servererror")
            }
            )
    }

    handleCompleteResponse = (response) =>{
        switch(response["data"]["resultCode"]){
            case 3420:
            case 3421:
            case 3422:
                this.setState({
                    orderComplete: true,
                    message: response["data"]["message"]
                });
                break;
            default:
                break;
        }
    };


    render() {
        const{orderComplete, message} = this.state;
        return (
            <div className="wrapper">
                {!(orderComplete) &&
                <h1>Loading</h1>
                }

                {(orderComplete) &&
                <div className="complete-content">
                    <FontAwesomeIcon icon={faShoppingCart} size="10x"/>
                    <h1>{message}</h1>
                </div>
                }
            </div>
        );

    }
}
export default Complete;