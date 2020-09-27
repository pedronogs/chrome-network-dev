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
    let $networkList = document.querySelector("#network-tab-content ul");
    request.id = request.id.replace(/\./,"");

    // Add request in request list
    $networkList.insertAdjacentHTML("beforeend", "<li id='" + request.id + "'>" + request.id + "</li>");

    // Cache DOM
    let $networkListItem = document.getElementById(request.id);

    // Event binding for newly added request item in list
    $networkListItem.addEventListener("click", renderRequestData);

    // Push current request data to all requests data
    networkData.push(request);
});

function renderRequestData (event) {
    console.log(networkData);
    var requestIndex = networkData.findIndex((request) => request.id === event.target.innerHTML);
    var request = networkData[requestIndex];
    var $networkContent = document.querySelector("#network-tab-content span");

    $networkContent.innerHTML = "";

    var data;
    try {
        data = JSON.parse(request.data);
    }
    catch {
        console.log(request);
        data = request.data;
    }

    $networkContent.innerHTML += "<strong>" + request.type.toUpperCase() + "</strong></br>" + data + "</br>";
}

