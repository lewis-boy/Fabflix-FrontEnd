import React, {Component, Fragment} from "react";

import Movie from "../services/Movie";
import FilterBar from "../FilterBar"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import "../css/people.css";

import ClipLoader from "react-spinners/ClipLoader";
import {basicPersonSearchUrl} from "../Config";
import {NavLink} from "react-router-dom";

class People extends Component {
    state = {
        rawPeopleResponse: [],
        peopleError: "",
        isMounted: false
    };

    createPeopleItem = (person) => {
        let profile_path = person["profile_path"];
        let person_id = person["person_id"];
        let name = person["name"];
        let birthday = person["birthday"] ? person["birthday"] : "No Popularity Number in Records" ;
        let popularity = person["popularity"] ? person["popularity"] : 0;
        return(
            <div className="person-wrapper" key={person_id}>
                <img src={basicPersonSearchUrl + profile_path} alt="" />
                <div className="row">
                    <h3>Name: </h3>
                    <h4>{name}</h4>
                </div>
                <div className="row">
                    <h3>Birthday: </h3>
                    <h4>{birthday}</h4>
                </div>
                <div className="row">
                    <h3>Popularity: </h3>
                    <h4>{popularity.toFixed(2)}</h4>
                </div>
            </div>
        )
    };


    componentDidMount() {
        console.log(this.props.match.params);
        console.log(this.props.location.search);

        Movie.basicPeopleSearch(this.props.location.search)
            .then(response => {
                this.handlePeopleSearch(response);
                this.setState({
                    isMounted: true
                })
            })
            .catch(error => {
                console.log(error);
                this.props.history.push("/servererror");
            })
    }

    handlePeopleSearch = (response) => {
        switch (response["data"]["resultCode"]) {
            case 213:
                this.setState({
                    rawPeopleResponse: []
                });
                break;
            case 212:
                this.setState({
                    rawPeopleResponse: response["data"]["people"]
                });
                break;
            default:
                this.setState({peopleError: "BadRequest Error"});
                break;
        }
    };


    render() {
        const {rawPeopleResponse, isMounted, peopleError} = this.state;

        return (
            <div className="wrapper">
                {
                    (rawPeopleResponse.length === 0) && (!isMounted) &&
                    <Fragment>
                        <h1>Looking For Person(s)</h1>
                        <ClipLoader
                            size={130}
                            color={"#FF0000"}
                            loading={rawPeopleResponse.length === 0}
                        />
                    </Fragment>
                }

                {
                    (rawPeopleResponse.length === 0) && (isMounted) &&
                    <Fragment>
                        <h1>{peopleError}</h1>
                    </Fragment>
                }

                {
                    (rawPeopleResponse.length !== 0) &&
                    <Fragment>
                        <div className="people-gallery flex-column">{rawPeopleResponse.map(this.createPeopleItem)}</div>
                    </Fragment>
                }


            </div>
        );
    }
}

export default People;