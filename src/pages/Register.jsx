import React, {Component} from "react";

import Idm from "../services/Idm";

import "../css/common.css";


class Register extends Component {
    state = {
        email: "",
        password: "",
        emailError: "",
        passwordError: ""
    };

    handleSubmit = e => {
        e.preventDefault();

        const {email, password} = this.state;

        //todo on .then split into two routes based on response: correct login vs incorrect login
        Idm.register(email, password)
            .then(response => {
                alert(JSON.stringify(response.data,null,4));
                switch(response["data"]["resultCode"]){
                    case -12:
                    case 12:
                    case 13:
                        this.setState({
                            emailError: "",
                            passwordError: response["data"]["message"]
                        });
                        break;
                    case -11:
                    case -10:
                    case 16:
                        this.setState({
                            emailError: response["data"]["message"],
                            passwordError: ""
                        });
                        break;
                    case 110:
                        this.props.history.push("/login");
                        break;
                    default:
                }
            })
            .catch(error => {
                if(error.response)
                    alert("Out of 200 bound: ");
                else if(error.request)
                    alert("No response was recieved")
                else
                    alert("500 error maybe... ")
            });
        //todo maybe make catch do some javascript
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
                    {this.state.emailError && <small className="loginRegisterError">{this.state.emailError}</small>}
                    <label className="label">Password</label>
                    <input
                        className="input"
                        type="password"
                        name="password"
                        placeholder="password"
                        value={password}
                        onChange={this.updateField}
                    ></input>
                    {this.state.passwordError && <small className="loginRegisterError">{this.state.passwordError}</small>}
                    <button className="button">Register</button>
                </form>
            </div>
        );
    }
}

export default Register;