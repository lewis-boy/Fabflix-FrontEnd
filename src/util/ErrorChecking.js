

export function httpErrorCheck(error){
    if(error.response)
        alert("Out of 200 bound: ");
    else if(error.request)
        alert("No response was received");
    else
        alert("500 error maybe... ");
}