var app = (function(){  
    
    var dirapi = "js/apiclient.js";

    
    var checkLoginUser= function(uname,password){
        $.getScript(dirapi, function() {
            apiclient.loginUser(uname,password,cbLogin,cbLoginError);
        });
        
    };

    var cbLogin = function (){   
        
        
    }; 
    
    var cbLoginError = function(resp){ 
        alert("Username or Password incorrect");
        
    };

    
    return{
      loginUser:function(username,password){
          checkLoginUser(username,password); 
          event.preventDefault();
      } 
    };



})();