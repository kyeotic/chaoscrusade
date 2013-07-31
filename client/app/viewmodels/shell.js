define(['plugins/router', 'knockout', 'durandal/app', 'viewmodels/login'], 
function (router, ko, app, login) {
    
    app.on('userlogin', function() { 
        app.log("user logged in"); 
    });
    
    var Shell = function() {
        var self = this;
        self.router = router;
        
        self.activate = function () {
            if(login.user().id().length === 0){
                app.log("login required");
                
                return app.showDialog(login).then(function(dialogResult){
                    return router.activate();
                });
            }
            app.log("login active");
            return router.activate();
        };
        
        //Used by the logout binding on the top bar
        self.logout = function() {
            login.logout();
        };
        
        //Also used by top bar
        self.loggedInUser = ko.computed(function() {
            var id = login.user().id();
            if (id.length === 0 || id === 0)
                return null;
            return login.user();
        });
    };
    
    return new Shell();
});