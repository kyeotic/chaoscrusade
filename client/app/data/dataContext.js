define(['knockout', 'durandal/app', 'models/campaign', 'models/skill'],
function(ko, app, Campaign, Skill) {

	var dataContext = {
		//Sets
		campaigns: ko.socketSet('campaigns', Campaign),
		skills: ko.socketSet('skills', Skill),

		//Properties
		selectedCampaign: ko.observable()
	};

	//This is the initial campaign load. We always want this set
	dataContext.campaigns.loadSet().then(function(set) {
		//app.log('campaigns loaded', ko.unwrap(set));
	});

	dataContext.selectCampaign = function(campaignId) {
		var campaign = dataContext.campaigns().find(function(c) {
			return c.id() === campaignId;
		});
		dataContext.selectedCampaign(campaign);
	};

	//Loading gets all the "meat" of the campaign, and subscribes to the socket
	//Unloading frees, stopping socket subscriptions
	dataContext.selectedCampaign.subscribeChanged(function(latestValue, previousValue) {
		//Previous value won't exist the first time
		if (previousValue) {
			app.log(['unloading campaign', previousValue.id()]);
			previousValue.unload();
		}
		app.log(['loading campaign', latestValue.id()]);
		latestValue.load();
	});

	return dataContext;
});