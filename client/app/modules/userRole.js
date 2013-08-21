define(['plugins/router'], function(router) {
	
	var roles = {
		user: [
			//Navs
			{ route: '', moduleId: 'viewmodels/welcome', title: 'Home', nav: true},
			{ route: 'skillEntry', moduleId: 'viewmodels/skillEntry', title: 'Skills', nav: true},
			
			
			//Routes
			{ route: 'campaign/:id*splat', moduleId: 'viewmodels/campaignPage', title: 'Campaign', nav: false}
		]
	};
	
	var setupRole = function(name) {
		var role = roles[name];

		if (role === undefined)
			return false;

		router.map(role).buildNavigationModel();

		window.router = router;

		return true;
	};
	
	return {
		setup: setupRole
	};
});