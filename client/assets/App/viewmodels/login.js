//Fix jsLINT
var ko = ko || {};

/*
    This module is intended to be used as a modal dialog    
*/

define(['durandal/plugins/router', 'durandal/app', 'modules/loginService', 'modules/cookie', 'modules/userRole', 'models/user'], 
function (router, app, loginService, cookie, userRole, User) {
    
    var LoginViewModel = function() {
        var self = this;
        self.returnRoute = ko.observable();
        
        self.user = ko.observable(new User());
        self.username = ko.observable("hdo1");
        self.password = ko.observable("pepue");
        self.rememberMe = ko.observable(false);
        
        self.resetForm = function() {
            self.username("");
            self.password("");
            //Don't reset rememberMe, this should stick
        };
        
        self.login = function(){
            loginService.login(self.username(), self.password(),
                //Success
                function(response) {
                    //Set User
                    self.user().update(response.user); //TODO: use a user type
                    loginService.setAuthToken(response.user);                
                    
                    userRole.setup(response.user.role);
                    
                    //Trigger other viewmodel updates
                    app.trigger('userlogin', response.user);
                    
                    if (self.modal)
                        self.modal.close(true);
                },
                //Error
                function(error) {
                    console.log(error);
            });
        };
        
        self.verifyLogin = function() {
            loginService.verifyLogin(function(response){
                console.log("verify successful");
                console.log(response);
            }, function (jqXHR, status, error){
                console.log("verify login failed");
                console.log(arguments);
            });
        };
    };
    
    //Login is a singleton
    var singleton = new LoginViewModel();
    window.loginDebug = singleton;
    
    return singleton;
});