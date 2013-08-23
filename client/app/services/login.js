define(['plugins/router', 'durandal/app', 'services/http'], 
function (router, app, http) {
	return {
		login: function(username, password) {
			var credentials = { username: username, password: password};
			return http.post('/login', { credentials: credentials });
		},
		isUsernameAvailable: function(username) {
            app.log(username);
			return http.get('/checkUsernameAvailable/' + username);
		},
		createLogin: function(user) {
			return http.put('/login', user);  
		},
		setAuthToken: function(token) {
		    http.setAuthToken(token);
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