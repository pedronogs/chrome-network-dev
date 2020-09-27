// Attaches debugger and listens for network requests and responses
chrome.debugger.attach(
    { tabId: 46 },
    "1.0",
    function () {
        // Enable network traffic listening
        chrome.debugger.sendCommand({ tabId: 46 }, "Network.enable");
        
        // Listens for events of Network type
        chrome.debugger.onEvent.addListener(function (source, method, data) {
            // If a response was received, get request post data and response body
            if (method == "Network.responseReceived") {
                // Gets post data by request ID provided in callback                
                chrome.debugger.sendCommand({ tabId: 46 }, "Network.getRequestPostData", { "requestId": data.requestId }, function (requestData) {
                    if (requestData.postData !== undefined) {
                        chrome.tabs.sendRequest(46, {
                            "id": data.requestId,
                            "type": "request",
                            "data": requestData.postData 
                        });
                    }
                });

                // Gets response body by request ID provided in callback
                chrome.debugger.sendCommand({ tabId: 46 }, "Network.getResponseBody", { "requestId": data.requestId }, function (responseBody) {
                    if (requestBody.body !== undefined) {
                        chrome.tabs.sendRequest(46, {
                            "id": data.requestId,
                            "type": "response",
                            "data": responseBody.body
                        });
                    }
                });
            }
        });
    }
);

