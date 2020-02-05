import Socket from "../util/Socket";
import { moviesEPs } from "../Config.json";
import { homePageGenre, homePageLimit } from "../Config.json";

const { randomEP, thumbnailEP, basicSearchEP } = moviesEPs;

async function getRandomMovies() {
    const params = {
        genre: homePageGenre,
        limit: homePageLimit
    };

    return await Socket.GETPARAMS(randomEP, params);
}

async function search(){
    return await Socket.GET(basicSearchEP)
}

// async function thumbnail() {
//
//     return await Socket.POST(thumbnailEP, )
// }

// async function register(email, password) {
//     const payLoad = {
//         email: email,
//         password: password.split("")
//     };
//
//     return await Socket.POST(registerEP, payLoad);
// }


export default {
    getRandomMovies
};
