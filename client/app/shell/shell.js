define(['plugins/router', 'knockout', 'durandal/app', 'login/login'], 
function (router, ko, app, login) {  
    return {
        router: router,
        activate: function() {
            login.show();
        },
        logout: function() {
            login.logout();
        },
        loggedInUser: login.loggedInUser
    };
});