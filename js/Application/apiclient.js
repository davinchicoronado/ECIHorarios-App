var apiclient = (function () {
    var client_secret = 'YXBpY2xpZW50OmNsaWVudDEyMw=='; 
    //var urlApi = "http://localhost:8080/";
    var urlApi = "https://ecihorarios.herokuapp.com/";



    var getDetailsUser = function (callback) {
        $.ajax({
            url: urlApi + "ecihorarios/user/" + localStorage.getItem("username"),
            type: 'GET',
            headers: {"Authorization": "Bearer " + JSON.parse(localStorage.getItem("token")).access_token},
            contentType: "application/json",
            'success': function (resp) {
                localStorage.setItem("userdetails", JSON.stringify(resp));
                callback();
            }
        });
    };

    var getSubjectAvailableStudent = function (student, callback) {
        $.ajax({
            url: urlApi + "ecihorarios/availablesubject/" + student.username,
            type: 'GET',
            headers: {"Authorization": "Bearer " + JSON.parse(localStorage.getItem("token")).access_token},
            contentType: "application/json",
            'success': function (resp) {
                callback(student, resp);
            }
        });
    };

    return {

        loginUser: function (uname, pword, callback, cberror) {

            $.ajax({
                url: urlApi + "oauth/token",
                type: 'POST',
                headers: {'Authorization': 'Basic ' + client_secret, //apiclient-client:client123-secret in Base64
                    "Content-Type": "application/x-www-form-urlencoded"},
                data: {username: uname, password: pword, "grant_type": "password"},
                contentType: "application/x-www-form-urlencoded",
                'success': function (resp) {
                    localStorage.setItem("token", JSON.stringify(resp));
                    localStorage.setItem("username", uname);
                    getDetailsUser(callback);

                },
                'error': function (XMLHttpRequest, textStatus, errorThrown) {
                    cberror(errorThrown);
                }
            });
        },

        getSubjectAvailable: function (callback) {
            $.ajax({
                url: urlApi + "ecihorarios/availablesubject/" + localStorage.getItem("username"),
                type: 'GET',
                headers: {"Authorization": "Bearer " + JSON.parse(localStorage.getItem("token")).access_token},
                contentType: "application/json",
                'success': function (resp) {
                    callback(resp);
                }
            });



        },

        getScheduleSubject: function (idSubject, callback) {
            $.ajax({
                url: urlApi + "ecihorarios/schedule/" + idSubject,
                type: 'GET',
                headers: {"Authorization": "Bearer " + JSON.parse(localStorage.getItem("token")).access_token},
                contentType: "application/json",
                'success': function (resp) {
                    callback(idSubject, resp);
                }
            });
        },
        saveScheduleStudent: function (subjects, callback) {
            $.ajax({
                url: urlApi + "ecihorarios/saveSchedule/" + localStorage.getItem("username"),
                type: 'POST',
                headers: {"Authorization": "Bearer " + JSON.parse(localStorage.getItem("token")).access_token},
                contentType: "application/json",
                data: JSON.stringify(subjects),
                'success': function (resp) {
                    callback();
                }
            });

        },
        enrollSubject: function (subjectGroup, callback) {
            $.ajax({
                url: urlApi + "ecihorarios/enrollSubject/" + localStorage.getItem("username"),
                type: 'PUT',
                data: JSON.stringify(subjectGroup),
                headers: {"Authorization": "Bearer " + JSON.parse(localStorage.getItem("token")).access_token},
                contentType: "application/json",
                'success': function (resp) {
                    getDetailsUser(callback);
                }

            }).fail(
                    function (jqXHR, textStatus, errorThrown) {
                        if (jqXHR.status === 403) {
                            alert('No hay cupos');
                        }
                    });

        },

        deleteSubject: function (subjectGroup, callback) {
            $.ajax({
                url: urlApi + "ecihorarios/deleteSubject/" + localStorage.getItem("username"),
                type: 'DELETE',
                data: JSON.stringify(subjectGroup),
                headers: {"Authorization": "Bearer " + JSON.parse(localStorage.getItem("token")).access_token},
                contentType: "application/json",
                'success': function (resp) {
                    getDetailsUser(callback);
                }

            });

        },

        getDetailsStudent: function (student, callback) {
            $.ajax({
                url: urlApi + "ecihorarios/user/" + student,
                type: 'GET',
                headers: {"Authorization": "Bearer " + JSON.parse(localStorage.getItem("token")).access_token},
                contentType: "application/json",
                'success': function (resp) {
                    getSubjectAvailableStudent(resp, callback);
                }
            });

        },
        enrollSubjectStudent: function (subjectGroup, student, callback) {
            $.ajax({
                url: urlApi + "ecihorarios/enrollSubjectStudent/" + student,
                type: 'PUT',
                data: JSON.stringify(subjectGroup),
                headers: {"Authorization": "Bearer " + JSON.parse(localStorage.getItem("token")).access_token},
                contentType: "application/json",
                'success': function (resp) {
                    callback();
                }

            });

        },
        getDetailsUser: function (callback) {
            getDetailsUser(callback);
        },

        clearSession: function (callback) {
            localStorage.clear();
            callback();
        }


    };


})();