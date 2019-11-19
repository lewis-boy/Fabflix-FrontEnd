import Axios from "axios";
import Cookies from "js-cookie";

import Config from "../Config.json";

const { baseUrl, pollLimit, gatewayEPs } = Config;

const HTTPMethod = Object.freeze({
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE"
});

function initSocket() {
  const { common } = Axios.defaults.headers;

  common["session_id"] = Cookies.get("session_id");

  Axios.defaults.baseURL = baseUrl;
}

async function GET(path) {
  return await sendHTTP(HTTPMethod.GET, path);
}

async function POST(path, data) {
  return await sendHTTP(HTTPMethod.POST, path, data);
}

async function DELETE(path) {
  return await sendHTTP(HTTPMethod.DELETE, path);
}

async function sendHTTP(method, path, data) {
  let response;

  switch (method) {
    case HTTPMethod.GET:
      response = await Axios.get(path);
      break;
    case HTTPMethod.POST:
      response = await Axios.post(path, data);
      break;
    case HTTPMethod.DELETE:
      response = await Axios.delete(path);
      break;
    default:
    // Should never reach here
  }

  /************************************************
        TODO Do error checking on response 
  ************************************************/

  return await getReport(response);
}

async function getReport(response) {
  const axiosConfig = {
    headers: { transactionid: response.headers["transactionid"] }
  };

  return await pollForReport(axiosConfig);
}

async function pollForReport(axiosConfig) {
  let noContent = 204;

  for (let i = 0; i < pollLimit; i++) {
    const response = await Axios.get(gatewayEPs.reportEP, axiosConfig);

    if (response.status !== noContent) {
      /************************************************
            TODO More Robust checking for response  
      ************************************************/

      return response;
    } else await timeOut();
  }

  return undefined;
}

async function timeOut() {
  return new Promise(resolve => {
    let pollingLimit = 100;
    setTimeout(() => resolve(), pollingLimit);
  });
}

export default {
  initSocket,
  GET,
  POST,
  DELETE
};
