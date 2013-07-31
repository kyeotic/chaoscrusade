define(['durandal/app', 'knockout', 'data/dataContext'], 
function(app, ko, dataContext) {
	return {
		activate: function() {
			app.log(arguments);
		};
	}
});