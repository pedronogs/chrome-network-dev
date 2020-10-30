chrome.tabs.query({active: true}, (response) => {
    // Get current Tab ID
    var currentTabId = response[0].id;

    // Attaches debugger and listens for network requests and responses
    chrome.debugger.attach(
        { tabId: currentTabId },
        "1.0",
        function () {
            // Enable network traffic listening
            chrome.debugger.sendCommand({ tabId: currentTabId }, "Network.enable");
            
            // Listens for events of Network type
            chrome.debugger.onEvent.addListener(function (source, method, data) {
                switch (method) {
                    // Event for requests
                    case "Network.requestWillBeSent":
                        // Check if request has query parameters and parse them
                        var queryParams = null;
                        if (data.request.url.indexOf('?') != '-1') {
                            let queryIndex = data.request.url.indexOf('?');
                            let queryLength = data.request.url.length;

                            queryParams = data.request.url.substr(queryIndex + 1, queryLength - queryIndex + 1);
                            queryParams = queryParams.split('&');
                        
                            queryParams = queryParams.map((param) => {
                                let explodedParam = param.split('=');

                                return { key: explodedParam[0], value: explodedParam[1] };
                            });
                        }

                        // Send request event to content script
                        chrome.tabs.sendRequest(currentTabId, {
                            "id": data.requestId,
                            "type": "request",
                            "method": data.request.method,
                            "url": data.request.url.replace('https://', '').split('?')[0],
                            "data": data.request.hasPostData === true ? data.request.postData : null,
                            "query_params": queryParams !== null ? queryParams : null
                        });

                        break;
                    // Event for responses
                    case "Network.responseReceived":
                        chrome.debugger.sendCommand({ tabId: currentTabId }, "Network.getResponseBody", { "requestId": data.requestId }, function (responseBody) {
                            if (requestBody.body !== undefined) {
                                chrome.tabs.sendRequest(currentTabId, {
                                    "id": data.requestId,
                                    "type": "response",
                                    // "url": data.response.url,
                                    "data": responseBody.body
                                });
                            }
                        });
                    default:
                        break;
                }
            });
        }
    );
});

