define(['durandal/plugins/router', 'durandal/app', 'viewmodels/login'], 
function (router, app, login) {
    
    app.on('userlogin', function() { 
        console.log("user logged in"); 
    });
    
    window.router = router;
    
    return {
        router: router,
        activate: function () {
            if(login.user().id().length === 0){
                console.log("login required");
                
                return app.showModal(login).then(function(dialogResult){
                    console.log(dialogResult);
                    router.activate(router.visibleRoutes()[0]);
                });
            }
            console.log("login active");
            return router.activate(router.visibleRoutes()[0]);
        }
    };
});