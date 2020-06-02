import React, {Component} from "react";
import {Link} from "react-router-dom"

import Idm from "../services/Idm";
import {httpErrorCheck} from "../util/ErrorChecking";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faExclamationTriangle, faTicketAlt} from "@fortawesome/free-solid-svg-icons";

import "../css/common.css";
import "../css/login.css";


class Login extends Component {
    state = {
        email: "",
        password: "",
        retypedPassword: "",
        errorMessage: ""
    };

    handleSubmit = e => {
        e.preventDefault();

        const {handleLogIn, history} = this.props;
        const {email, password, retypedPassword} = this.state;

        if(password !== retypedPassword){
            this.setState({
                errorMessage: "Passwords do not match"
            })
        }else {
            Idm.login(email, password)
                .then(response => {
                    console.log(response);
                    switch (response["data"]["resultCode"]) {
                        case -12:
                        case -11:
                        case -10:
                        case 11:
                        case 14:
                            console.log("GOT other codes");
                            this.setState({
                                errorMessage: response["data"]["message"]
                            });
                            break;
                        case 120:
                            console.log("GOT 120");
                            //there might be an error in this if we can somehow get back to the login page
                            //error as in: the messages might still be up, if so find a way to clear error messages after login
                            handleLogIn(email, response["data"]["session_id"]);
                            //do idm call for home page and create loading page
                            history.push("/home");
                            break;
                        default:
                            console.log("GOT default");
                    }
                })
                .catch(error => {
                    httpErrorCheck(error);
                });
        }
    };

    updateField = ({target}) => {
        const {name, value} = target;

        this.setState({[name]: value});
    };

    render() {
        const {email, password, retypedPassword} = this.state;
        //todo make the login page erase the fields if login is incorrect(add more to the state)
        //todo have some react elements invisible but turn on when you get your first incorrect login
        return (
            <div className="login-wrapper">
                <FontAwesomeIcon icon={faTicketAlt} size="7x"/>
                {this.state.errorMessage &&
                    <div className="error-message">
                        <FontAwesomeIcon icon={faExclamationTriangle} size="2x"/>
                        <p>{this.state.errorMessage}</p>
                    </div>
                }
                <form className="login-form" onSubmit={this.handleSubmit}>
                    <label className="label">Email</label>
                    <input
                        className="login-input"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={this.updateField}
                    />
                    <label className="label">Password</label>
                    <input
                        className="login-input"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={this.updateField}
                    />
                    <input
                        className="login-input"
                        type="password"
                        name="retypedPassword"
                        placeholder="Re-type Password"
                        value={retypedPassword}
                        onChange={this.updateField}
                    />
                    <button className="login-button">LOGIN</button>
                    <p>Don't have an account? Sign up <Link to="/register">here</Link>.</p>
                </form>
            </div>
        );
    }
}

export default Login;
