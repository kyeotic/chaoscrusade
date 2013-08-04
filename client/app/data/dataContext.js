define(['knockout', 'models/campaign', 'models/skill'],
function(ko, Campaign, Skill) {

	var dataContext = {
		//Sets
		campaigns: ko.socketSet('campaigns', Campaign),
		skills: ko.socketSet('skills', Skill),

		//Properties
		selectedCampaign: ko.observable()
	};

	//This is the initial campaign load. We always want this set
	dataContext.campaigns.loadSet().then(function(set) {
		app.log(ko.unwrap(set));
	});

	//Loading gets all the "meat" of the campaign, and subscribes to the socket
	//Unloading frees, stopping socket subscriptions
	dataContext.selectedCampaign.subscribeChanged(function(latestValue, previousValue) {
		//Previous value won't exist the first time
		if (previousValue)
			previousValue.unload();
		latestValue.load();
	});

	return dataContext;
});