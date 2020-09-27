draggable(document.querySelector('#network-tab'), document.querySelector('#network-tab-move')); 

function draggable(movableElement, movingElement) { 
    movingElement.addEventListener('mousedown', function (event) { 
        var offsetX = event.clientX - parseInt(window.getComputedStyle(movableElement).left); 
        var offsetY = event.clientY - parseInt(window.getComputedStyle(movableElement).top); 
        
        function mouseMoveHandler(event) { 
            movableElement.style.top = (event.clientY - offsetY) + 'px'; 
            movableElement.style.left = (event.clientX - offsetX) + 'px'; 
        } 
        
        function reset() { 
            window.removeEventListener('mousemove', mouseMoveHandler); 
            window.removeEventListener('mouseup', reset); 
        } 
        
        window.addEventListener('mousemove', mouseMoveHandler); 
        window.addEventListener('mouseup', reset); 
    }); 
}