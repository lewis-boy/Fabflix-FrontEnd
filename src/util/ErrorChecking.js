

export function httpErrorCheck(error){
    if(error.response)
        return new Error("Out of 200 bound: ");
    else if(error.request)
        return new Error("Connection Refusal for now");
    else
        return new Error("500 error maybe... ");
}