var app = (function () {

    var dirapi = "js/apiclient.js";
    var urlApp = "http://localhost/ECIHorarios/";
    var view = "#Inicio";
    var detailsUser;

    var checkLoginUser = function (uname, password) {
        $.getScript(dirapi, function () {
            apiclient.loginUser(uname, password, cbLogin, cbLoginError);
        });

    };


    var getDetailsUser = function () {
        $.getScript(dirapi, function () {
            apiclient.getDetailsUser(cbDetailsUser);
        });
    };


    var getAvailableSubject = function () {
        hideCurrentView();
        view = "#Preinscribir";
        showCurrentView();


    };

    var getSchedules = function () {
        hideCurrentView();
        view = "#Tushorarios";
        showCurrentView();

    };

    var getMenu = function () {
        hideCurrentView();
        view = "#Inicio";
        showCurrentView();

    };

    var logOut = function () {
        window.location.href = urlApp + "login.html";
        $.getScript(dirapi, function () {
            apiclient.clearSession();
        });


    };

    var cbLogin = function () {
        getDetailsUser();

    };

    var cbLoginError = function (resp) {
        alert("Username or Password incorrect");

    };

    var cbDetailsUser = function (details) {
        detailsUser = details;
        window.location.href = urlApp + "menu.html";


    };


    var hideCurrentView = function () {
        $(view).hide();

    };

    var showCurrentView = function () {
        $(view).show();
    };

    return{
        loginUser: function (username, password) {
            checkLoginUser(username, password);
            event.preventDefault();
        },

        querySubject: function () {
            getAvailableSubject();
            event.preventDefault();
        },

        getSchedules: function () {
            getSchedules();
            event.preventDefault();
        },

        menu: function () {
            getMenu();
            event.preventDefault();
        },

        exit: function () {
            logOut();
            event.preventDefault();
        }


    };



})();