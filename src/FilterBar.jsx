import React, {Component} from "react";
import {withRouter, Link} from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleUp, faAngleDown} from "@fortawesome/free-solid-svg-icons";

import "./css/common.css";

class FilterBar extends Component {



    render() {
        const currentPath = this.props.location.search.split("&orderby")[0];
        const currentUrl = this.props.location.pathname;
        //get methods from parent to handle clicks

        return (
            <div className="filterbar-container">
                <Link to={currentUrl + currentPath + "&orderby=title&direction=asc"}>
                    title up<FontAwesomeIcon icon={faAngleUp} />
                </Link>
                <Link to={currentUrl + currentPath + "&orderby=title&direction=desc"}>
                    title down<FontAwesomeIcon icon={faAngleDown}/>
                </Link>
                <Link to={currentUrl + currentPath + "&orderby=rating&direction=asc"}>
                    rating up<FontAwesomeIcon icon={faAngleUp}/>
                </Link>
                <Link to={currentUrl + currentPath + "&orderby=rating&direction=desc"}>
                    rating down<FontAwesomeIcon icon={faAngleDown}/>
                </Link>
            </div>
        );
    }
}

export default withRouter(FilterBar);