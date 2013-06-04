define(['durandal/plugins/router', 'durandal/app', 'modules/serviceBase'], 
function (router, app, serviceBase) {
    return {
        login: function(username, password, success, failure) {
            var credentials = { username: username, password: password};
            serviceBase.post('/login', { credentials: credentials }, success, failure);
        },
        setAuthToken: function(token) {
            serviceBase.setAuthToken(token);
        },
        verifyLogin: function(success, failure) {
            serviceBase.post('verifyLogin', {}, success, failure);
        },
        logout: function(){
            //clear the cookie, when we are using one
            
            /*
                Logout navigates to the homepage after logging out to clear the app
                If we forget to unload something, we could leave sensitive data in memory
                By navigating, we safely ensure that the entire app restarts,
                without needed to clutter our app code with "unload on logout" bits
            */
            window.location.href = "/";
        }
    };
});