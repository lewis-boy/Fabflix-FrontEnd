import Socket from "../util/Socket";
import { billingEPs } from "../Config.json";

const {insertEP, updateEP, deleteEP, retrieveEP, clearEP, orderPlaceEP, orderRetrieveEP, orderCompleteEP} = billingEPs;

async function cartInsert(email, movie_id, quantity){
    const payLoad = {
        email: email,
        movie_id: movie_id,
        quantity: quantity
    };
    return await Socket.POST(insertEP, payLoad);
}

async function cartUpdate(email, movie_id, quantity){
    const payLoad = {
        email: email,
        movie_id: movie_id,
        quantity: quantity
    };
    return await Socket.POST(updateEP, payLoad);
}

async function cartDelete(email, movie_id){
    const payLoad = {
        email: email,
        movie_id: movie_id
    };
    return await Socket.POST(deleteEP, payLoad);
}

async function cartRetrieve(email){
    const payLoad = {
        email: email
    };
    return await Socket.POST(retrieveEP, payLoad);
}

async function cartClear(email){
    const payLoad = {
        email: email
    };
    return await Socket.POST(clearEP, payLoad);
}

async function orderPlace(email){
    const payLoad = {
        email: email
    };
    return await Socket.POST(orderPlaceEP, payLoad);
}

async function orderComplete(path){
    return await Socket.GET(orderCompleteEP + path);
}

async function orderRetrieve(email){
    const payload = {
        email: email
    };
    return await Socket.POST(orderRetrieveEP, payload);
}

export default {cartInsert,
    cartUpdate,
    cartDelete,
    cartRetrieve,
    cartClear,
    orderPlace,
    orderRetrieve,
    orderComplete};