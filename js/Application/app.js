var app = (function () {

    var dirapi = "js/Application/apiclient.js";
    var urlApp = "http://localhost/ECIHorarios/";
    var view = "#Inicio";
    var limitCredits;
    var userdetails;
    var creditsCurrentSub; 
    var preenrolledSubjects;

    var checkLoginUser = function (uname, password) {
        $.getScript(dirapi, function () {
            apiclient.loginUser(uname, password, cbLogin, cbLoginError);
        });

    };



    var getAvailableSubject = function () {

        preenrolledSubjects = [];
        userdetails = JSON.parse(localStorage.getItem("userdetails"));
        limitCredits = userdetails.limitCredits;

        $.getScript(dirapi, function () {
            apiclient.getSubjectAvailable(cbAvailableSubjects);
        });
    };

    var getSchedulesSubjects = function () {  
        
        $( "#TableSubject tbody tr" ).on( "click", function() {
            var currentRow=$(this).closest("tr");
            idSubject = currentRow.find("td:eq(0)").text().trim();
            nameSchedule = currentRow.find("td:eq(1)").text().trim(); 
            creditsCurrentSub = parseInt(currentRow.find("td:eq(2)").text().trim()); 
            
            
            
            $("#titleSchedule").empty();
            
            
            $("#titleSchedule").html(`${nameSchedule}`); 
            
            $.getScript(dirapi,function(){        
                apiclient.getScheduleSubject(idSubject,cbScheduleSubjects);  
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
    var preenrollSubject = function(){
        $( "#TableSchedule" ).on( "click",".btn", function() { 
            
            if(limitCredits-creditsCurrentSub<0){
                //alert("No tienes mas creditos");
            }
            else{
                var currentRow=$(this).closest("tr");

                var groupid = currentRow.find("td:eq(0)").text().trim();
                console.log("veces");
                limitCredits = limitCredits-creditsCurrentSub;
                $("#credits").html("Creditos: "+`${limitCredits}`);



                preenrolledSubjects.push({group:parseInt(groupid),subjectid:idSubject});

                
                //alert("Materia Agregada"); 
                $(".btn-primary").attr("disabled", true);
            }
             
            
        });
        
        
    }; 
    var saveScheduleStudent = function(){
      if(preenrolledSubjects.length==0){
            alert("Debes agregar alguna materia"); 
            
        }
        else{
            $.getScript(dirapi,function(){        
                apiclient.saveScheduleStudent(preenrolledSubjects,cbsaveSchedule);  
            });
            
        }
        
    };

    var cbLogin = function () {
        window.location.href = urlApp + "menu.html";
    };

    var cbLoginError = function (resp) {
        alert("Username or Password incorrect");

    }; 
    
    var cbLogOut = function () {
        window.location.href = urlApp + "login.html";
    };
    
    
    var cbAvailableSubjects = function(resp){ 

        $("#saveSchedule").hide(); 
        $("#credits").html("Creditos: "+`${limitCredits}`); 
        $("#tbody2").empty();
        $("#tbody").empty(); 
        for(let subject of resp){
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
 
    var cbScheduleSubjects = function(idSchedule, resp){ 
        
        
        $("#saveSchedule").show();
        $("#tbody2").empty(); 
        
        for(let schedule of resp){
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
                       <td onClick="app.preenrollSubject()"><button class="btn btn-primary">Enroll</button></td>
                   </tr>
                    `
                    );
            
            
        } 
        isAddSchedule(idSchedule);
        for(let schedule of resp){ 
            for(let group of schedule.lessons){
                
                $("#"+`${schedule.numGroup}`).append(
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
    
    
    var cbsaveSchedule = function(){
            
            alert("Horario Guardado");
            
            hideCurrentView();
            
            $("#Inicio").show(); 
            view = "#Inicio";
            
        
    };
    
    
    
    var isAddSchedule = function(idSch){
        if(!(preenrolledSubjects.length==0)){
            for(let subject of preenrolledSubjects){
                if(subject.subjectid==idSch){
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

        preenrollSubject:function(){
            preenrollSubject();
            event.preventDefault();  
        },
        
        saveScheduleStudent:function(){
            saveScheduleStudent();
            event.preventDefault();
            
        },
        
        exit: function () {
            logOut();
            event.preventDefault();
        }


    };



})();