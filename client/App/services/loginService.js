define(['plugins/router', 'durandal/app', 'modules/serviceBase'], 
function (router, app, serviceBase) {
	return {
		login: function(username, password) {
			var credentials = { username: username, password: password};
			return serviceBase.post('/login', { credentials: credentials });
		},
		isUsernameAvailable: function(username) {
            app.log(username);
			return serviceBase.get('/checkUsernameAvailable/' + username);
		},
		createLogin: function(user) {
			return serviceBase.put('/login', user);  
		},
		setAuthToken: function(token) {
		    serviceBase.setAuthToken(token);
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