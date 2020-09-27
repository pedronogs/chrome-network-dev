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

