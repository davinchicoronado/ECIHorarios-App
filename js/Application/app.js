var app = (function () {

    var dirapi = "js/Application/apiclient.js";
    var urlApp = "http://localhost/ECIHorarios/";
    var view = "#Inicio";
    var limitCredits;
    var userdetails;
    var studentdetails;
    var creditsCurrentSub;
    var enrolledSubjects;
    var idSubject;
    var nameSchedule;

    var checkLoginUser = function (uname, password) {
        $.getScript(dirapi, function () {
            apiclient.loginUser(uname, password, cbLogin, cbLoginError);
        });

    };



    var getAvailableSubject = function () {
        userdetails = JSON.parse(localStorage.getItem("userdetails"));

        enrolledSubjects = userdetails.enrolledsubject;
        limitCredits = userdetails.limitCredits;

        $.getScript(dirapi, function () {
            apiclient.getSubjectAvailable(cbAvailableSubjects);
        });
    };

    var getSchedulesSubjects = function () {

        $("#TableSubject tbody tr").on("click", function () {
            var currentRow = $(this).closest("tr");
            idSubject = currentRow.find("td:eq(0)").text().trim();
            nameSchedule = currentRow.find("td:eq(1)").text().trim();
            creditsCurrentSub = parseInt(currentRow.find("td:eq(2)").text().trim());



            $("#titleSchedule").empty();


            $("#titleSchedule").html(`${nameSchedule}`);

            $.getScript(dirapi, function () {
                apiclient.getScheduleSubject(idSubject, cbScheduleSubjects);
            });

        });





    };

    var getMenu = function () {
        hideCurrentView();
        view = "#Inicio";
        showCurrentView();

    };

    var logOut = function () {
        $.getScript(dirapi, function () {
            apiclient.clearSession(cbLogOut);
        });


    };
    var enrollSubject = function () {
        $("#TableSchedule").on("click", ".btn", function () {

            if (limitCredits - creditsCurrentSub < 0) {
                alert("No tienes mas creditos");
            } else {
                var currentRow = $(this).closest("tr");

                var groupid = currentRow.find("td:eq(0)").text().trim();

                enrolledSubjects.push({group: parseInt(groupid), subjectid: idSubject});
                $.getScript(dirapi, function () {
                    apiclient.enrollSubject({group: parseInt(groupid), subjectid: idSubject}, cbenrollSubject);
                });




            }


        });


    };
    var enrollSubjectStudent = function () {
        $("#TableSchedule").on("click", ".btn", function () {

            if (studentdetails.limitCredits - creditsCurrentSub < 0) {
                alert("El estudiante no tiene mas creditos");
            } else {
                var currentRow = $(this).closest("tr");

                var groupid = currentRow.find("td:eq(0)").text().trim();
                studentdetails.limitCredits = studentdetails.limitCredits-creditsCurrentSub;
               
                $.getScript(dirapi, function () {
                    apiclient.enrollSubjectStudent({group: parseInt(groupid), subjectid: idSubject},studentdetails.username,cbenrollSubjectStudent);
                });




            }


        });
    };

    var saveScheduleStudent = function () {
        if (enrolledSubjects.length == 0) {
            alert("Debes agregar alguna materia");

        } else {
            $.getScript(dirapi, function () {
                apiclient.saveScheduleStudent(enrolledSubjects, cbsaveSchedule);
            });

        }

    };

    var getScheduleStudent = function () {

        $("#tbody3").empty();

        var subjects = JSON.parse(localStorage.getItem("userdetails")).enrolledsubject;

        for (let subject of subjects) {

            $("#tbody3").append(
                    `
                      <tr onclick="app.getDetailsGroup()">
                       <td>${subject.group} </td>
                       <td>${subject.subjectid}</td> 
                       <td onClick="app.deleteSubject()"><button class="btn btn-danger">Delete</button></td>
                      </tr>
                      `
                    );
        }


        hideCurrentView();
        view = "#Tushorarios";
        showCurrentView();

    };

    var deleteSubjectStudent = function () {

        $("#TableScheduleStudent").on("click", ".btn", function () {
            var currentRow = $(this).closest("tr");

            var groupid = currentRow.find("td:eq(0)").text().trim();
            var idSubject = currentRow.find("td:eq(1)").text().trim();


            $.getScript(dirapi, function () {
                apiclient.deleteSubject({group: parseInt(groupid), subjectid: idSubject}, cbdeleteSubject);
            });


        });

    };

    var getDetailsStudent = function () {

        hideCurrentView();
        view = "#InscribirAdmin";
        showCurrentView();


    };
    var searchStudent = function (student) {

        $.getScript(dirapi, function () {
            apiclient.getDetailsStudent(student, cbsearchStudent);
        });


    };

    var cbsearchStudent = function (student, availables) {


        studentdetails = student;
        $("#credits").html("Creditos: " + `${studentdetails.limitCredits}`);
        $("#tbody2").empty();
        $("#tbody").empty();

        for (let subject of availables) {
            var flag = true;
            for (let enrolled of studentdetails.enrolledsubject) {
                if (subject.code == enrolled.subjectid) {
                    flag = false;
                }

            }
            if (flag) {
                $("#tbody").append(
                        `
                      <tr onclick="app.getSchedulesSubjects()">
                       <td>${subject.code} </td>
                       <td>${subject.name}</td>
                       <td>${subject.credits}</td>
                       <td>${subject.level}</td>
                      </tr>
                      `
                        );
            }
        }

    };

    var cbLogin = function () {
        userdetails = JSON.parse(localStorage.getItem("userdetails"));
        if (userdetails.tipo === 'E') {
            window.location.href = urlApp + "menu.html";
        } else {
            window.location.href = urlApp + "menuAdmin.html";
        }


    };

    var cbLoginError = function (resp) {
        alert("Username or Password incorrect");

    };

    var cbLogOut = function () {
        window.location.href = urlApp + "login.html";
    };


    var cbAvailableSubjects = function (resp) {

        $("#saveSchedule").hide();
        $("#credits").html("Creditos: " + `${limitCredits}`);
        $("#tbody2").empty();
        $("#tbody").empty();
        for (let subject of resp) {
            $("#tbody").append(
                    `
                      <tr onclick="app.getSchedulesSubjects()">
                       <td>${subject.code} </td>
                       <td>${subject.name}</td>
                       <td>${subject.credits}</td>
                       <td>${subject.level}</td>
                      </tr>
                      `
                    );
        }

        hideCurrentView();
        view = "#Preinscribir";
        showCurrentView();
    };



    var cbScheduleSubjects = function (idSchedule, resp) {


        //$("#saveSchedule").show();
        $("#tbody2").empty();
        var typepet;
        if (JSON.parse(localStorage.getItem("userdetails")).tipo == 'E') {
            var typepet = "app.enrollSubject()";
        } else {
            var typepet = "app.enrollSubjectStudent()";

        }




        for (let schedule of resp) {
            $("#tbody2").append(
                    `
                   <tr> 
                       <td>${schedule.numGroup} </td>
                       <td>${schedule.teacher}</td>
                       <td>${schedule.limit}</td>
                       <td>
                            <table class="table"  id="Subtable">
                                        <tr>
                                              <th>Hora</th>
                                              <th>Salon</th>
                                              <th>Dia</th>
                                        </tr>
                                        <tbody id=${schedule.numGroup}>
                                        </tbody>
                            </table>  
            
                       </td>   
                       <td onClick=${typepet}><button class="btn btn-primary">Enroll</button></td>
                   </tr>
                    `
                    );
        }
        if (JSON.parse(localStorage.getItem("userdetails")).tipo == 'E') {
            isAddSchedule(idSchedule);
        }

        for (let schedule of resp) {
            for (let group of schedule.lessons) {

                $("#" + `${schedule.numGroup}`).append(
                        `
                        <tr>
                            <td>${group.hour} </td>
                            <td>${group.classRoom}</td>
                            <td>${group.day}</td>
                        </tr>
                        `
                        );
            }
        }

    };


    var cbsaveSchedule = function () {

        alert("Horario Guardado");

        hideCurrentView();

        $("#Inicio").show();
        view = "#Inicio";


    };

    var cbenrollSubject = function () {
        alert("Materia Agregada");
        limitCredits = JSON.parse(localStorage.getItem("userdetails")).limitCredits;
        $("#credits").html("Creditos: " + `${limitCredits}`);
        $(".btn-primary").attr("disabled", true);

    }; 
    var cbenrollSubjectStudent = function(){
        alert("Materia Agregada");  
        $("#credits").html("Creditos: " + `${studentdetails.limitCredits}`); 
        $(".btn-primary").attr("disabled", true);
   
    };

    var cbdeleteSubject = function () {
        getScheduleStudent();

    };

    var isAddSchedule = function (idSch) {
        if (!(enrolledSubjects.length == 0)) {
            for (let subject of enrolledSubjects) {
                if (subject.subjectid == idSch) {
                    $(".btn-primary").attr("disabled", true);
                }
            }

        }

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

        getSchedulesSubjects: function () {
            getSchedulesSubjects();
            event.preventDefault();
        },

        menu: function () {
            getMenu();
            event.preventDefault();
        },

        enrollSubject: function () {
            enrollSubject();
            event.preventDefault();
        },
        enrollSubjectStudent: function () {
            enrollSubjectStudent();
            event.preventDefault();
        },

        saveScheduleStudent: function () {
            saveScheduleStudent();
            event.preventDefault();

        },

        getSchedule: function () {
            getScheduleStudent();
            event.preventDefault();
        },

        deleteSubject: function () {
            deleteSubjectStudent();
            event.preventDefault();
        },
        getDetailsGroup: function () {
            getDetailsGroup();
            event.preventDefault();
        },

        getDetailsStudent: function () {
            getDetailsStudent();
            event.preventDefault();
        },

        searchStudent: function (student) {
            searchStudent(student);
            event.preventDefault();
        },

        exit: function () {
            logOut();
            event.preventDefault();
        }


    };



})();