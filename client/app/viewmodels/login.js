define(['durandal/app', 'jquery', 'knockout', 'plugins/dialog', 'data/dataContext', 'services/loginService', 'modules/cookie', 'modules/userRole', 'models/user', 'viewmodels/createUser'], 
function (app, $, ko, dialog, dataContext, loginService, cookie, userRole, User, createUser) {
    
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

        self.loginFailed = ko.observable(false);
        self.loginFailed.subscribe(function(newValue) {
            if (newValue)
                setTimeout(function() {
                    self.loginFailed(false);
                }, 2000);
        });
        
        self.login = ko.qCommand({
            execute: function(){
                return loginService.login(self.username(), self.password())
                    .then(function(response) {
                        cookie.set(authToken, response);
                        self.setLogin(response);
                    }).fail(function(error) {
                        self.loginFailed(true);
                        self.password('');
                        app.log(error);
                    });
            },
            canExecute: function(isExecuting) {
                app.log("isExecuting", isExecuting);
                return !isExecuting
                        && self.password().length > 0
                        && self.username().length > 0;
            }
        });

        ;
        
        self.setLogin = function(response) {
            //Set User
            self.user().update(response.user);
            self.user().password("");
            loginService.setAuthToken(response.token);                
            
            userRole.setup(response.user.role);
            
            //Trigger other viewmodel updates
            app.trigger('userlogin', response.user);

            dialog.close(self, true);

            
        };

        self.show = function() {
            if(self.user().id().length === 0){
                app.log("login required");

                //This is a stopgap to force the showing of the login modal
                setTimeout(function() {
                    var theDialog = dialog.getDialog(self);
                    $(theDialog.host).css('opacity', 1);
                }, 1000)
                
                return app.showDialog(self)
                    .then(function() {
                        return dataContext.load();
                    })
                    .then(function(dialogResult) {
                        return router.activate();
                    });
            }

            app.log("login active");

            return dataContext.load().then(function() {
                router.activate();
            });
        };

        self.loggedInUser = ko.computed(function() {
            var id = self.user().id();
            if (id.length === 0 || id === 0)
                return null;
            return self.user();
        });
        
        self.showCreateLogin = function() {
            app.showDialog(createUser)
                .then(function(result) {
                    if (!result) //cancelled or failed
                        return;
                    cookie.set(authToken, result);
                    self.setLogin(result);
                }).fail(function(error) {
                    app.log("error", error);
                }).done();
        };

        self.logout = function () {
            cookie.remove(authToken);
            /*
               Logout navigates to the homepage after logging out to clear the app
               If we forget to unload something, we could leave sensitive data in memory
               By navigating, we safely ensure that the entire app restarts,
               without needing to clutter our app code with "unload on logout" bits
           */
            window.location.href = "/";
        };
    };
    
	var loginVM = new LoginViewModel();
	
    var storedCookie = cookie.get(authToken);
    if (storedCookie)
        loginVM.setLogin(storedCookie);
    
    return loginVM;
});