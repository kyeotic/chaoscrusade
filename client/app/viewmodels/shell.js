define(['plugins/router', 'knockout', 'durandal/app', 'viewmodels/login'], 
function (router, ko, app, login) {
    
    app.on('userlogin', function() { 
        app.log("user logged in"); 
    });
    
    var Shell = function() {
        var self = this;
        self.router = router;
        
        self.activate = function () {
            return login.show();
        };
        
        //Used by the logout binding on the top bar
        self.logout = function() {
            login.logout();
        };
        
        //Also used by top bar
        self.loggedInUser = login.loggedInUser;
    };
    
    return new Shell();
});