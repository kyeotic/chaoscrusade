define(['durandal/plugins/router', 'durandal/app', 'viewmodels/login'], 
function (router, app, login) {
    
    app.on('userlogin', function() { 
        app.log("user logged in"); 
    });
    
    window.router = router;
    
    var Shell = function() {
        var self = this;
        self.router = router;
        
        self.activate = function () {
            if(login.user().id().length === 0){
                app.log("login required");
                
                return app.showModal(login).then(function(dialogResult){
                    router.activate(router.visibleRoutes()[0].url);
                });
            }
            app.log("login active");
            return router.activate(router.visibleRoutes()[0].url);
        };
        
        self.logout = function() {
            login.logout();
        };
        
        self.loggedInUser = ko.computed(function() {
            var id = login.user().id();
            if (id.length === 0 || id === 0)
                return null;
            return login.user();
        });
    };
    
    return new Shell();
});