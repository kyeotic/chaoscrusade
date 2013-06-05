define(['durandal/plugins/router', 'durandal/app', 'modules/loginService', 'modules/cookie', 'modules/userRole', 'models/user'], 
function (router, app, loginService, cookie, userRole, User) {
    
    var authToken = "ccAuthToken";
    
    var LoginViewModel = function() {
        var self = this;
        self.returnRoute = ko.observable();
        
        self.user = ko.observable(new User());
        self.username = ko.observable("");
        self.password = ko.observable("");
        self.rememberMe = ko.observable(false);
        
        self.resetForm = function() {
            self.username("");
            self.password("");
            //Don't reset rememberMe, this should stick
        };
        
        self.login = function(){
            loginService.login(self.username(), self.password())
            .then(function(response) {
                cookie.set(authToken, response);
                self.setLogin(response);
            }).fail(function(error) {
                console.log(error);
            }).done();
        };
        
        self.setLogin = function(resposne) {
            //Set User
            self.user().update(response.user);
            self.user().password("");
            loginService.setAuthToken(response.token);                
            
            userRole.setup(response.user.role);
            
            //Trigger other viewmodel updates
            app.trigger('userlogin', response.user);
            
            if (self.modal)
                self.modal.close(true);
        };
        
        self.showingCreateLogin = ko.observable(false);
        self.showCreateLogin = function() { self.showingCreateLogin(true); };
        self.cancelCreateLogin = function() { self.showingCreateLogin(false); };
        
        self.usernameAvailability = ko.observable("unchecked");
        self.user().username.subscribe(function(newValue) {
            loginService.isUsernameAvailable(newValue)
            .then(function(response) {
                self.usernameAvailability(response ? "yes" : "no");
            }).fail(function(error){
                app.log(error);
                self.usernameAvailability("no");
            }).done()
        });
        
        self.createLogin = function() {
            self.user().keepPassword = true;
            loginService.createLogin(self.user())
            .then(function(response) {
                cookie.set(authToken, response);
                self.setLogin(response);
            }).fail(function(error) {
                app.log(error);
            }).done();
        };
    };
    
    var storedCookie = cookie.get(authToken);
    if (storedCookie)
        loginVm.setLogin(storedCookie);
    
    //Login is a singleton
    var singleton = new LoginViewModel();
    window.loginDebug = singleton;
    
    return singleton;
});