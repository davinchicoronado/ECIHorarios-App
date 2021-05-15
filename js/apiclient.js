var apiclient = (function () {
    var client_secret = 'YXBpY2xpZW50OmNsaWVudDEyMw==';
    var urlApi = "http://localhost:8080/";

    return {
        loginUser: function (uname, pword, callback, cberror) {

            $.ajax({
                url: urlApi + "oauth/token",
                type: 'POST',
                headers: {'Authorization': 'Basic ' + client_secret, //android-client:android-secret in Base64
                    "Content-Type": "application/x-www-form-urlencoded"},
                data: {username: uname, password: pword, "grant_type": "password"},
                contentType: "application/x-www-form-urlencoded",
                'success': function (resp) {
                    localStorage.setItem("token", JSON.stringify(resp)); 
                    localStorage.setItem("username", uname);
                    callback();

                },
                'error': function (XMLHttpRequest, textStatus, errorThrown) {
                    cberror(errorThrown);
                }
            });
        },

        getDetailsUser: function (callback) {
            $.ajax({
                url: urlApi + "ecihorarios/user/" + localStorage.getItem("username"),
                type: 'GET',
                headers: {"Authorization": "Bearer " + JSON.parse(localStorage.getItem("token")).access_token},
                contentType: "application/json",
                'success': function (resp) {
                    callback(resp);
                }
            });
        }, 
        
        clearSession : function(){
            localStorage.clear();   
        }

    };


})();