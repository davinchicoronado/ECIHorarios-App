var apiclient = (function () {
    var client_secret =  'YXBpY2xpZW50OmNsaWVudDEyMw==';
    var urlApi = "http://localhost:8080/oauth/token";
    
    return {
        loginUser: function (uname, pword, callback,cberror) {

            $.ajax({
                url: urlApi,
                type: 'POST',
                headers: {'Authorization': 'Basic '+client_secret, //android-client:android-secret in Base64
                     "Content-Type" : "application/x-www-form-urlencoded"},
                data: {username: uname, password: pword, "grant_type": "password"},
                contentType: "application/x-www-form-urlencoded",
                'success': function (resp) { 
                    localStorage.setItem("token",JSON.stringify(resp)); 
                    callback();

                },
                'error': function (XMLHttpRequest, textStatus, errorThrown) {
                    cberror(errorThrown);
                }
            });

        }


    };

})();