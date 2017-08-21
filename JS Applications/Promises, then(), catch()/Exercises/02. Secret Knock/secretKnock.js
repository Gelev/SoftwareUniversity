let appId = "kid_BJXTsSi-e";

let baseURL = "https://baas.kinvey.com/appdata/kid_BJXTsSi-e/knock";
let requestURL = baseURL + "?query=Knock Knock.";

let token = "Basic " + btoa("guest:guest");

console.log("Knock Knock.");

$.ajax({
    url: requestURL,
    headers: {
        "Authorization": token,
        "Content-Type": "application/json"
    },
    success: function (success){
        console.log(success.answer);
        console.log(success.message);

        $.ajax({
            method: "GET",
            url: baseURL + "?query=" + success.message,
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            success: function (success2){
                console.log(success2.answer);
                console.log(success2.message);

                $.ajax({
                    method: "GET",
                    url: baseURL + "?query=" + success2.message,
                    headers: {
                        "Authorization" : token,
                        "Content-Type": "application/json"
                    },
                    success: function(success3){
                        console.log(success3.answer);
                    }
                })
            },
            error: function(error2){
                console.log("Second level error!");
            }
        });
    },
    error: function error() {
        console.log("Error!");
    }

})