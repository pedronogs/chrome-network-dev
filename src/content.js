// Fetch network tab HTML
fetch(chrome.extension.getURL('/src/networktab/networktab.html'))
    .then(response => response.text())
    .then(data => {
        document.querySelector("body").insertAdjacentHTML('afterbegin', data);
    })
    .catch(error => {
        console.log(error);
    });


// Fetch network tab script to make it draggable
fetch(chrome.extension.getURL('/src/networktab/networktab.js'))
    .then(response => response.text())
    .then(data => {
        var script = document.createElement('script');
        script.textContent = data;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    })
    .catch(error => {
        console.log(error);
    });

// Listens for requests messages
var networkData = [];
chrome.extension.onRequest.addListener(function (request) {   
    let $networkList = document.querySelector("#network-tab-content #network-requests");
    request.id = request.id.replace(/\./,"");

    // Add request in request list
    $networkList.insertAdjacentHTML("beforeend", `<div class='request-div'><span id='${request.id}'><span style='font-weight: bolder;'>${request.method}</span> ${request.url}</span></div>`);

    // Cache DOM
    let $networkListItem = document.getElementById(request.id);

    // Event binding for newly added request item in list
    $networkListItem.addEventListener("click", renderRequestData);

    // Push current request data to all requests data
    networkData.push(request);
});

// Render request data on clicking some request message
function renderRequestData (event) {
    var requestIndex = networkData.findIndex((request) => request.id === event.target.id);
    var request = networkData[requestIndex];
    var $networkContent = document.querySelector("#network-tab-content #network-data");

    $networkContent.innerHTML = "";

    $networkContent.innerHTML += `
    <strong>REQUEST</strong></br></br>
    <strong>URL:</strong> ${request.url}</br></br>
    <strong>Method: </strong>${request.method}</br></br>
    ${request.method === "GET" 
        ? "<strong>Query Params: </strong><pre>" + syntaxHighlight(JSON.stringify(request.query_params, null, 2)) + "</pre>"
        : "<strong>Post Data: </strong><pre>" + syntaxHighlight(JSON.stringify(JSON.parse(request.data), null, 2)) + "</pre></br></br>"}
    `;
}

// Syntax highlighting for JSON output
function syntaxHighlight (json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
