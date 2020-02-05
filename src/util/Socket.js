import Axios from "axios";
import Cookies from "js-cookie";

import Config from "../Config.json";

const {baseUrl, pollLimit, gatewayEPs} = Config;

const HTTPMethod = Object.freeze({
    GET: "GET",
    POST: "POST",
    DELETE: "DELETE"
});

function initSocket() {
    const {common} = Axios.defaults.headers;

    common["session_id"] = Cookies.get("session_id");

    Axios.defaults.baseURL = baseUrl;
}

async function GET(path) {
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

//TODO learn to make calls with attached parameters


//TODO ask VINCENT if it would be better to add query params to String rather than pass in an object
async function sendHTTP(method, path, data, queryParams, pathParams) {
    let response;
    let config = setupConfig(queryParams, pathParams)

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

    //response["data"] to get map
    //maybe session_update?? or transaction_id?? or request_delay???
    /************************************************
     TODO Do error checking on response
     ************************************************/

    return await getReport(response);
}

function setupConfig(queryParams, pathParams){
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
    //todo maybe add an initial waiting time before the first report Polling
    let noContent = 204;

    for (let i = 0; i < pollLimit; i++) {
        const response = await Axios.get(gatewayEPs.reportEP, axiosConfig);

        //todo you can trigger catch by throw new Error("whooops") or reject(new Error("whooops"))
        if (response.status !== noContent) {
            console.log(response.status)
            /************************************************
             TODO More Robust checking for response
             ************************************************/


            return response;
        } else await timeOut(response.headers["request_delay"]);
    }
    console.log("Problem is here in Socket.js");

    //todo on the receiving end use something like: if typeof(value) !== undefined ... do something
    return undefined;
}

async function timeOut(requestDelay) {
    return new Promise(resolve => {
        //maybe switch pollingLimit with headers requestDelay
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
