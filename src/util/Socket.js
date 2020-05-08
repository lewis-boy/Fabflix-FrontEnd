import Axios from "axios";

import Config from "../Config.json";

const {baseUrl, pollLimit, gatewayEPs} = Config;

const HTTPMethod = Object.freeze({
    GET: "GET",
    POST: "POST",
    DELETE: "DELETE"
});

function initSocket() {
    const {common} = Axios.defaults.headers;

    //random codde line
    common["session_id"] = localStorage.getItem("session_id");
    common["email"] = localStorage.getItem("email");
    console.log(common["session_id"]);
    console.log(common["email"]);

    Axios.defaults.baseURL = baseUrl;
}

async function GET(path) {
    console.log(path);
    return await sendHTTP(HTTPMethod.GET, path);
}

async function GETPARAMS(path, params) {
    return await sendHTTP(HTTPMethod.GET, path, null, params);
}

async function POST(path, data) {
    return await sendHTTP(HTTPMethod.POST, path, data);
}

async function DELETE(path) {
    return await sendHTTP(HTTPMethod.DELETE, path);
}



async function sendHTTP(method, path, data, queryParams, pathParams) {
    let response;
    let config = setupConfig(queryParams, pathParams);
    console.log("Console logging works in JS");

        switch (method) {
            case HTTPMethod.GET:
                response = await Axios.get(path, config);
                break;
            case HTTPMethod.POST:
                response = await Axios.post(path, data, config);
                break;
            case HTTPMethod.DELETE:
                response = await Axios.delete(path, config);
                break;
            default:
                throw new Error("Invalid HTTPMethod Given");
            // Should never reach here
        }

        //i got an idm response back which means there is something wrong with our credentials or some type of JSON error
        if(response.status === 200 || response.status === 400) {
            console.log("IDM RESPONSE");
            return response;
        }
        //todo i dont know what to do with 500's
    /************************************************
     TODO add new session you get from response
     TODO do i need to login, what if login is wrong, bad request handling happen here
     TODO admin checking, privilege level checking
     TODO maybe something with cancel token
     ************************************************/

    return await getReport(response);
}

function setupConfig(queryParams){
    let config = {};
    config.validateStatus = function (status) {
        return !(status === 500);
    }

    if(queryParams !== null)
        config.params = queryParams;
    return config;
}

async function getReport(response) {
    const axiosConfig = {
        headers: {
            transaction_id: response.headers["transaction_id"],
            request_delay: response.headers["request_delay"]
        }
    };

    return await pollForReport(axiosConfig);
}

async function pollForReport(axiosConfig) {
    let noContent = 204;
    let serverError = 500;

    for (let i = 0; i < pollLimit; i++) {
        const response = await Axios.get(gatewayEPs.reportEP, axiosConfig);

        //todo you can trigger catch by throw new Error("whooops") or reject(new Error("whooops"))
        if (response.status !== noContent) {
            if(response.status === serverError)
                break;
            /************************************************
             TODO Did i get a 500 instead of a 204, if i did stop polling: gateway is closed
             ************************************************/


            return response;
        } else await timeOut(response.headers["request_delay"]);
    }
    //todo on the receiving end use something like: if typeof(value) !== undefined ... do something
    return undefined;
}

async function timeOut(requestDelay) {
    return new Promise(resolve => {
        let pollingLimit = requestDelay;
        setTimeout(() => resolve(), pollingLimit);
    });
}

export default {
    initSocket,
    GET,
    GETPARAMS,
    POST,
    DELETE
};
