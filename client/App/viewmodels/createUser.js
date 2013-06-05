define(['models/user'],
function(User) {
    
    var CreateUser = function() {
        var self = this;
        
        self.user = new User();
        self.usernameAvailability = ko.observable("unchecked");
        
        self.checkUser = ko.qCommand({
            execute: function() {
                return loginService.isUsernameAvailable(self.usernameAvailability())
                .then(function(response) {
                    self.usernameAvailability(response ? "Yes" : "No");
                }).fail(function(error){
                    app.log(error);
                    self.usernameAvailability("No");
                }).done();
            }
        });
        
        self.user.username.subscribe(function(newValue) {
            self.checkUser();
        });
        
        self.createLogin = function() {
            self.user.keepPassword = true;
            return loginService.createLogin(self.user)
                    .then(function(response) {
                        if (self.modal)
                            self.modal.close(response);
                        return response;
                    });
        };
    
        self.cancel = function() {
            if (self.modal)
                self.modal.close(false);
            return false;
        };
    };
    
    return new CreateUser();
});