import React, {Component} from "react";

import Idm from "../services/Idm";
import {httpErrorCheck} from "../util/ErrorChecking";

import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";

import "../css/common.css";
import "../css/login.css";


class Register extends Component {
    state = {
        email: "",
        password: "",
        errorMessage: ""
    };

    handleSubmit = e => {
        e.preventDefault();

        const {email, password} = this.state;

        //todo on .then split into two routes based on response: correct login vs incorrect login
        Idm.register(email, password)
            .then(response => {
                console.log(JSON.stringify(response.data,null,4));
                switch(response["data"]["resultCode"]){
                    case -12:
                    case -11:
                    case -10:
                    case 12:
                    case 13:
                    case 16:
                        this.setState({
                            errorMessage: response["data"]["message"]
                        });
                        break;
                    case 110:
                        this.props.history.push("/login");
                        break;
                    default:
                }
            })
            .catch(error => {
                httpErrorCheck(error);
            });
    };

    updateField = ({target}) => {
        const {name, value} = target;

        this.setState({[name]: value});
    };

    render() {
        const {email, password} = this.state;
        //todo make the login page erase the fields if login is incorrect(add more to the state)
        //todo have some react elements invisible but turn on when you get your first incorrect login
        return (
            <div>
                <h1>Register</h1>
                {this.state.errorMessage &&
                <div className="error-message">
                    <FontAwesomeIcon icon={faExclamationTriangle} size="2x"/>
                    <p>{this.state.errorMessage}</p>
                </div>
                }
                <form onSubmit={this.handleSubmit}>
                    <label className="label">Email</label>
                    <input
                        className="input"
                        type="email"
                        name="email"
                        placeholder="email"
                        value={email}
                        onChange={this.updateField}
                    ></input>
                    <label className="label">Password</label>
                    <input
                        className="input"
                        type="password"
                        name="password"
                        placeholder="password"
                        value={password}
                        onChange={this.updateField}
                    ></input>
                    <button className="button">Register</button>
                    <p>Have an account already? Log in <Link to="/login">here</Link>.</p>
                </form>
            </div>
        );
    }
}

export default Register;