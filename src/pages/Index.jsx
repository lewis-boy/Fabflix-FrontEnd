import React, {Component} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCameraRetro} from "@fortawesome/free-solid-svg-icons";
import {NavLink} from "react-router-dom";

import "../css/index.css";


class Index extends Component {
    render() {
        return (
            <div className="index-wrapper">
                <div className="title-wrapper">
                    <FontAwesomeIcon icon={faCameraRetro} size="6x"/>
                    <p>FabFlix</p>
                </div>
                <p>WANT TO BUY MOVIES?</p>
                <div className="button-wrapper">
                    <NavLink className="button" to="/login">
                        Login
                    </NavLink>
                    <NavLink className="button" to="/register">
                        Register
                    </NavLink>
                </div>
            </div>
        )
    }
}

export default Index;