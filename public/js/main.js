(function(namespace, undefined) {
    namespace.sendLogin = function (dataSend, apiLink, responseId, UlId) {
        var xmlhttp = new XMLHttpRequest(),
            serverResponse; // new HttpRequest instance
        if(typeof dataSend === 'object') {
            dataSend = JSON.stringify(dataSend);
        }
        xmlhttp.onreadystatechange = function() {
            serverResponse = xmlhttp.responseText;
            if(xmlhttp.readyState === 4) {
                
                //serverResponse = JSON.parse(serverResponse);
                window.location = "/";
            }
        };
        xmlhttp.open("POST", apiLink, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(dataSend);
        //JSON.stringify({name:"John Rambo", time:"2pm"})
    }
    
    //Private Function for posting a notification of failure
    function notification (msg, notificationId) {
        var responseIdEl = document.getElementById(notificationId);
        responseIdEl.classList.remove("visible-hidden");
        responseIdEl.classList.add("show-response");
        responseIdEl.innerHTML = msg;
        setTimeout(function() {

            responseIdEl.classList.remove("show-response");
            responseIdEl.classList.add("visible-hidden");
        }, 6000);
    };
    
    
})(window.utilities = window.utilities || {});

$(function() {
    $('a[href^="#"]').on('click', function(event) {
        console.log(event.target.dataset.scrollid);
        var target = $(event.target.dataset.scrollid);
        if( target.length ) {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 1000);
        }
    });
});
