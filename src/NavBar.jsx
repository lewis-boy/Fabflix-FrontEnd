import React, {Component, Fragment} from "react";
import {NavLink, withRouter} from "react-router-dom";

import "./css/style.css";
import "./css/navbar.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter, faShoppingCart, faLayerGroup, faSearch, faTimesCircle} from "@fortawesome/free-solid-svg-icons";

class NavBar extends Component {
    state = {
        searchBar: "",
        titleBar: "",
        directorBar: "",
        yearBar: "",
        starBar: "",
        genreBar: "",
        filterToggle: false,
        extraFiltersToggle: false
    };

    handleNavClick = (e) => {
        if(sessionStorage.getItem("session_id") === null) {
            e.preventDefault();
            console.log("NO SESSION");
        }
    };

    filterClick = () => {
        // console.log("false * 300 = " + (false * 300));
        // console.log("true * 300 = " + (true * 300));
        // console.log("false + 300 = " + (false + 300));
        // console.log("true + 300 = " + (true + 300));
        this.setState({filterToggle: true});
    };

    filterModalXClick = () => {
        this.setState({filterToggle: false})
    };

    extraFiltersClick = () => {
        this.setState({extraFiltersToggle: true})
    };

    extraFiltersXClick = () => {
        this.setState({extraFiltersToggle: false})
    };

    extraFiltersSubmitClick = () => {
        const titleSearch = this.state.titleBar;
        const directorSearch = this.state.directorBar;
        const yearSearch = this.state.yearBar;
        const starSearch = this.state.starBar;
        const genreSearch = this.state.genreBar;
        this.clearExtras();
        this.extraFiltersXClick();
        starSearch===""?
            this.makeQueryAndSend(titleSearch,directorSearch,yearSearch,genreSearch):
            this.props.history.push("/movies/people?name=" + starSearch);
    };

    clearExtras = () => {
        this.setState({
            titleBar: "",
            directorBar: "",
            yearBar: "",
            starBar: "",
            genreBar: ""
        })
    };

    makeQueryAndSend = (title, director, year, genre) => {
        let url = "/movies/search?offset=0";
        url += (title !== ""? ("&title="+title) : "");
        url += (director !== ""? ("&director="+director) : "");
        url += (year !== ""? ("&year="+year) : "");
        url += (genre !== ""? ("&genre="+genre) : "");
        this.props.history.push(url);
    };

    onSearchClick = () => {
        const search = this.state.searchBar;
        this.setState({searchBar: ""});
        this.props.history.push("/movies/search?title=" + search);
    };

    updateField = ({target}) => {
        const {name, value} = target;
        this.setState({[name]: value});
    };


    render() {
        const {handleLogOut, loggedIn} = this.props;
        const {searchBar, directorBar, starBar, yearBar, genreBar, titleBar} = this.state;
        const modalHide = this.state.filterToggle ? "" : " hide";
        const extraHide = this.state.extraFiltersToggle ? "" : " hide";

        return (
            <nav className="nav-bar">
                <div className={"extra-filters" + extraHide}>
                    <button className="exit-button" onClick={this.extraFiltersXClick}>
                        <FontAwesomeIcon icon={faTimesCircle} />
                    </button>
                    <input
                        size="15"
                        className="searchBar"
                        type="search"
                        name="titleBar"
                        value={titleBar}
                        placeholder="By title..."
                        onChange={this.updateField}>
                    </input>
                    <input
                        size="15"
                        className="searchBar"
                        type="search"
                        name="directorBar"
                        value={directorBar}
                        placeholder="By director..."
                        onChange={this.updateField}>
                    </input>
                    <input
                        size="15"
                        className="searchBar"
                        type="search"
                        name="yearBar"
                        value={yearBar}
                        placeholder="By year..."
                        onChange={this.updateField}>
                    </input>
                    <input
                        size="15"
                        className="searchBar"
                        type="search"
                        name="starBar"
                        value={starBar}
                        placeholder="By star..."
                        onChange={this.updateField}>
                    </input>
                    <input
                        size="15"
                        className="searchBar"
                        type="search"
                        name="genreBar"
                        value={genreBar}
                        placeholder="By genre..."
                        onChange={this.updateField}>
                    </input>
                    <button className="submit-button" onClick={this.extraFiltersSubmitClick}>
                        Submit
                    </button>
                </div>
                <div className={"filter-modal" + modalHide}
                      style={{transform: "translateY(" + (this.state.filterToggle * 40) + "%)"}}>
                    <div className="modal-header">
                        <h1>Genres</h1>
                        <button onClick={this.filterModalXClick}>
                            <FontAwesomeIcon icon={faTimesCircle} />
                        </button>
                    </div>
                    <hr />
                    <div className="filter-genres">
                        <NavLink to="/movies/search?genre=action">Action</NavLink>
                        <NavLink to="/movies/search?genre=adventure">Adventure</NavLink>
                        <NavLink to="/movies/search?genre=animation">Animation</NavLink>
                        <NavLink to="/movies/search?genre=comedy">Comedy</NavLink>
                        <NavLink to="/movies/search?genre=crime">Crime</NavLink>
                        <NavLink to="/movies/search?genre=documentary">Documentary</NavLink>
                        <NavLink to="/movies/search?genre=drama">Drama</NavLink>
                        <NavLink to="/movies/search?genre=family">Family</NavLink>
                        <NavLink to="/movies/search?genre=fantasy">Fantasy</NavLink>
                        <NavLink to="/movies/search?genre=history">History</NavLink>
                        <NavLink to="/movies/search?genre=horror">Horror</NavLink>
                        <NavLink to="/movies/search?genre=music">Music</NavLink>
                        <NavLink to="/movies/search?genre=mystery">Mystery</NavLink>
                        <NavLink to="/movies/search?genre=romance">Romance</NavLink>
                        <NavLink to="/movies/search?genre=science fiction">Science Fiction</NavLink>
                        <NavLink to="/movies/search?genre=TV movie">TV Movie</NavLink>
                        <NavLink to="/movies/search?genre=thriller">Thriller</NavLink>
                        <NavLink to="/movies/search?genre=war">War</NavLink>
                        <NavLink to="/movies/search?genre=western">Western</NavLink>
                    </div>
                    <div className="modal-footer">
                        <h1>Titles</h1>
                    </div>
                    <hr />
                    <div className="filter-titles">
                        <div className="number-titles">
                            <NavLink to="/movies/search?title=0">0</NavLink>
                            <NavLink to="/movies/search?title=1">1</NavLink>
                            <NavLink to="/movies/search?title=2">2</NavLink>
                            <NavLink to="/movies/search?title=3">3</NavLink>
                            <NavLink to="/movies/search?title=4">4</NavLink>
                            <NavLink to="/movies/search?title=5">5</NavLink>
                            <NavLink to="/movies/search?title=6">6</NavLink>
                            <NavLink to="/movies/search?title=7">7</NavLink>
                            <NavLink to="/movies/search?title=8">8</NavLink>
                            <NavLink to="/movies/search?title=9">9</NavLink>
                        </div>
                        <div className="letter-titles">
                            <NavLink to="/movies/search?title=A">A</NavLink>
                            <NavLink to="/movies/search?title=B">B</NavLink>
                            <NavLink to="/movies/search?title=C">C</NavLink>
                            <NavLink to="/movies/search?title=D">D</NavLink>
                            <NavLink to="/movies/search?title=E">E</NavLink>
                            <NavLink to="/movies/search?title=F">F</NavLink>
                            <NavLink to="/movies/search?title=G">G</NavLink>
                            <NavLink to="/movies/search?title=H">H</NavLink>
                            <NavLink to="/movies/search?title=I">I</NavLink>
                            <NavLink to="/movies/search?title=J">J</NavLink>
                            <NavLink to="/movies/search?title=K">K</NavLink>
                            <NavLink to="/movies/search?title=L">L</NavLink>
                            <NavLink to="/movies/search?title=M">M</NavLink>
                            <NavLink to="/movies/search?title=N">N</NavLink>
                            <NavLink to="/movies/search?title=O">O</NavLink>
                            <NavLink to="/movies/search?title=P">P</NavLink>
                            <NavLink to="/movies/search?title=Q">Q</NavLink>
                            <NavLink to="/movies/search?title=R">R</NavLink>
                            <NavLink to="/movies/search?title=S">S</NavLink>
                            <NavLink to="/movies/search?title=T">T</NavLink>
                            <NavLink to="/movies/search?title=U">U</NavLink>
                            <NavLink to="/movies/search?title=V">V</NavLink>
                            <NavLink to="/movies/search?title=W">W</NavLink>
                            <NavLink to="/movies/search?title=X">X</NavLink>
                            <NavLink to="/movies/search?title=Y">Y</NavLink>
                            <NavLink to="/movies/search?title=Z">Z</NavLink>
                        </div>
                    </div>
                </div>


                <div className="left-nav-buttons">
                    <NavLink className="home-link nav-link" to="/home" onClick={this.handleNavClick}>
                        Home
                    </NavLink>
                    {loggedIn &&
                    <NavLink className="left-link nav-link left-link" to="/movies">
                        Movies
                    </NavLink>
                    }
                </div>
                <div className="mid-nav-buttons">
                    {loggedIn && (
                        <Fragment>
                            <button className="navbar-button" onClick={this.filterClick}>
                                <FontAwesomeIcon icon={faFilter} size="1x"/>
                            </button>
                            <input
                                size="30"
                                className="searchBar"
                                type="search"
                                name="searchBar"
                                value={searchBar}
                                placeholder="Find movies by title..."
                                onChange={this.updateField}>
                            </input>
                            <button className="navbar-button" onClick={this.onSearchClick} >
                                <FontAwesomeIcon icon={faSearch} size="1x"/>
                            </button>
                        </Fragment>)
                    }
                </div>
                <div className="right-nav-buttons">
                    {loggedIn && (<Fragment>
                        <button className="navbar-button" onClick={this.extraFiltersClick}>
                            <FontAwesomeIcon icon={faLayerGroup} size="1x"/>
                        </button>
                        <FontAwesomeIcon icon={faShoppingCart} size="1x"/>
                        <button onClick={handleLogOut} className="nav-button">
                            Log Out
                        </button>
                    </Fragment>)}
                </div>
            </nav>
        );
    }
}

export default withRouter(NavBar);
