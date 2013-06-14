define(['durandal/plugins/router', 'durandal/app', 
    'modules/loginService', 'modules/cookie', 'modules/userRole', 
    'models/user', 'viewmodels/createUser'], 
function (router, app, loginService, cookie, userRole, User, 
    createUser) {
    
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
        
        self.setLogin = function(response) {
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
        
        self.showCreateLogin = function() {
            app.showModal(createUser)
            .then(function(result) {
                if (!result) //cancelled or failed
                    return;
                cookie.set(authToken, result);
                self.setLogin(result);
            }).fail(function(error) {
                app.log("error", error);
            }).done();
        };
    };
    
	var loginVM = new LoginViewModel();
	
    var storedCookie = cookie.get(authToken);
    if (storedCookie)
        loginVM.setLogin(storedCookie);
    
    return loginVM;
});