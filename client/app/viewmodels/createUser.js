define(['durandal/app', 'jquery', 'knockout', 'plugins/dialog', 'models/user', 'services/loginService'],
function(app, $, ko, dialog, User, loginService) {
    
    var CreateUser = function() {
        var self = this;
        
        self.user = new User();
        self.usernameAvailability = ko.observable("unchecked");
        
        self.checkUser = ko.qCommand({
            execute: function() {
                return loginService.isUsernameAvailable(self.user.username())
                .then(function(response) {
                    self.usernameAvailability(response ? "Yes" : "No");
                }).fail(function(error){
                    app.log(error);
                    self.usernameAvailability("No");
                });
            }
        });
        
        self.user.username.subscribe(function(newValue) {
            self.checkUser();
        });

        self.show = function() {           
            return app.showDialog(self);
        };
        
        self.createLogin = function() {
            self.user.keepPassword = true;
            return loginService.createLogin(self.user)
                    .then(function(response) {
                        if (dialog.getDialog(self))
                            dialog.close(self, response);
                        return response;
                    });
        };
    
        self.cancel = function() {
            if (dialog.getDialog(self))
                    dialog.close(self, false);
            return false;
        };
    };
    
    return new CreateUser();
});