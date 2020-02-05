import React, {Component} from "react";

import Idm from "../services/Idm";

import "../css/common.css";


class Login extends Component {
    state = {
        email: "",
        password: "",
        emailError: "",
        passwordError: ""
    };

    handleSubmit = e => {
        e.preventDefault();

        const {handleLogIn} = this.props;
        const {email, password} = this.state;

        //todo on .then split into two routes based on response: correct login vs incorrect login
        Idm.login(email, password)
            .then(response => {
                alert(JSON.stringify(response.data,null,4));
                console.log(response);
                switch(response["data"]["resultCode"]){
                    case -12:
                    case 11:
                        this.setState({
                            emailError: "",
                            passwordError: response["data"]["message"]
                        });break;
                    case -11:
                    case -10:
                        this.setState({
                            emailError: response["data"]["message"],
                            passwordError: ""
                        });break;
                    case 14:
                        this.setState({
                            emailError: "User not found with provided credentials",
                            passwordError: "User not found with provided credentials"
                        });break;
                    case 120:
                        //there might be an error in this if we can somehow get back to the login page
                        //error as in: the messages might still be up, if so find a way to clear error messages after login
                        handleLogIn(email, response["data"]["session_id"]);
                        this.props.history.push('/movies');
                        break;
                    default:
                }
                //handleLogIn(email, response["data"]["session_id"]);
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
                <h1>Login</h1>
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
                    {this.state.emailError && <small className="loginError">{this.state.emailError}</small>}
                    <label className="label">Password</label>
                    <input
                        className="input"
                        type="password"
                        name="password"
                        placeholder="password"
                        value={password}
                        onChange={this.updateField}
                    ></input>
                    {this.state.passwordError && <small className="loginError">{this.state.passwordError}</small>}
                    <button className="button">Login</button>
                </form>
            </div>
        );
    }
}

export default Login;
