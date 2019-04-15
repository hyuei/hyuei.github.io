class ZidoConnect {
    constructor() {
        //todo: change this to real domain on deploy
        this.domain = window.location.hostname;

        this.domainTargetOrigins = ["zidoworld.com", "localhost"];

        this.gameId = "";
        this.token = "";
        this.api = "";
    }

    setDomainTargetOrigins(domainTargetOriginArr) {
        this.domainTargetOrigins = domainTargetOriginArr;
    }

    isInTargetOrigins(text) {

        if (this.domainTargetOrigins == null) {
            console.log("Domain target origins array is null");
            return false;
        }

        for (var i = 0; i < this.domainTargetOrigins.length; i++) {
            if (this.domainTargetOrigins[i].indexOf(text)) {
                return true;
            } else if (this.domainTargetOrigins[i] === "*") {
                console.log("Wildcard all");
                return true;
            }
        }
        return false;
    }

    listenMessageEvent(onDataReceived) {
        var ref = this;
        window.addEventListener('message', function (event) {
            console.log("origin: " + event.origin);
            console.log("ref: " + ref);
            if (ref.isInTargetOrigins(event.origin)) {
                // message captured
                // ex:
                // {
                // gameId:, token:, api:
                // }
                console.log("Data received");
                ref.gameId = event.data.gameId;
                ref.token = event.data.token;
                ref.api = event.data.api;
                console.log(event.data);

                if (onDataReceived !== null) {
                    // //TODO: Check validated
                    // if(event.data.hasOwnProperty('isSuccess'))
                    // {
                    //     if(event.data.isSuccess === true)
                    //     {
                    //         onDataReceived(1);
                    //     }
                    //     else
                    //     {
                    //         onDataReceived(-1);
                    //     }
                    // }

                    onDataReceived(1);
                }
            } else {
                console.log("data sent by another domain");
                onDataReceived(-1);
                return;
            }
        });
    }

    get(onResult, onFail) {
        var data = null;

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.onreadystatechange = function () {
            console.log("status: " + this.status);
            if (xhr.readyState === 4 && this.status === 200) {
                console.log("result")
                console.log(xhr.responseText);

                if (onResult != null) {
                    onResult(xhr.responseText);
                }

            } else {

                if (onFail != null) {
                    onFail(this.status);
                }

            }
        }

        xhr.open("GET", this.api + "/games/" + this.gameId);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("authorization", "Bearer " + this.token);

        xhr.send(data);
    }

    post(data, onResult, onFail) {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && (this.status === 200 || this.status === 204) ) {
                console.log(this.responseText);

                if (onResult != null) {
                    onResult(this.responseText);
                }
            } else {
                console.log("API RETURN STATUS:" + this.status);
                // unauthorized or no content
                if (onFail != null) {
                    onFail(this.responseText);
                }
            }
        }

        xhr.open("POST", this.api + "/games/" + this.gameId);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("authorization", "Bearer " + this.token);
        xhr.send(data);
    }

    testDispatchEvent(isSuccess) {
        var message = { 'isSuccess': isSuccess, 'gameId': '123', 'token': 'qwert', 'api': 'http://localhost/123' };
        var url = "http://" + window.location.hostname;
        window.postMessage(message, url);
    }
}