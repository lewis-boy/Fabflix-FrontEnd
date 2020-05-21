import Socket from "../util/Socket";
import { moviesEPs } from "../Config.json";
import { homePageGenre, homePageLimit } from "../Config.json";

const { randomEP, basicSearchEP, phraseSearchEP, peopleMovieSearchEP, movieIdSearchEP, thumbnailEP, basicPeopleSearchEP} = moviesEPs;

async function getRandomMovies() {
    const params = {
        genre: homePageGenre,
        limit: homePageLimit
    };

    return await Socket.GETPARAMS(randomEP, params);
}

async function search(){
    return await Socket.GET(basicSearchEP);
}

async function movieIdSearch(movieId){
    return await Socket.GET(movieIdSearchEP + encodeURIComponent(movieId))
}

async function browseSearch(pathParam, query){
    //encodedURIComponent did not work
    return await Socket.GET(phraseSearchEP + encodeURIComponent(pathParam) + query);
}

async function basicSearch(query){
    return await Socket.GET(basicSearchEP + query);
}

async function peopleSearch(query){
    return await Socket.GET( peopleMovieSearchEP + query);
}

async function basicPeopleSearch(query){
    return await Socket.GET( basicPeopleSearchEP + query);
}




async function thumbnail(movieIds) {
    const payload = {
        movie_ids: movieIds
    };
    return await Socket.POST(thumbnailEP, payload)
}

// async function register(email, password) {
//     const payLoad = {
//         email: email,
//         password: password.split("")
//     };
//
//     return await Socket.POST(registerEP, payLoad);
// }


export default {
    getRandomMovies,
    search,
    browseSearch,
    basicSearch,
    peopleSearch,
    movieIdSearch,
    thumbnail,
    basicPeopleSearch
};
