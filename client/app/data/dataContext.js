define(['knockout', 'durandal/app', 'models/campaign', 'models/skill'],
function(ko, app, Campaign, Skill) {

	var dataContext = {
		//Sets
		campaigns: ko.socketSet('campaigns', Campaign),
		skills: ko.socketSet('skills', Skill)
	};

	//The campaigns need to load to allow the router to select the campaign
	//A lot of stuff also depends on the "root" sets being populated
	dataContext.load = function() {
		return app.deferAll([ //This really is an array, stop "fixing" it
			dataContext.campaigns.loadSet(),
			dataContext.skills.loadSet()
		]).fail(function() {
			app.log('dataContext failed to load');
		});
	};

	/*
		Campaign
	*/

	//The empty campaign stops us from having to check for null 
	//campaigns everywhere else in the app
	var emptyCampaign = new Campaign();
	var selectedCampaign = ko.observable();
	dataContext.selectedCampaign = ko.computed({
		read: function () {
			return selectedCampaign() || emptyCampaign;
		},
		write: function(value) {
			selectedCampaign(value || emptyCampaign);
		}
	})

	dataContext.selectCampaign = function(campaignId) {
		var campaign = dataContext.campaigns().find(function(c) {
			return c.id() === campaignId;
		});
		dataContext.selectedCampaign(campaign);
	};

	//Loading gets all the "meat" of the campaign, and subscribes to the socket
	//Unloading frees, stopping socket subscriptions
	selectedCampaign.subscribeChanged(function(latestValue, previousValue) {
		//Previous value won't exist the first time
		if (previousValue) {
			app.log(['unloading campaign', previousValue.id()]);
			previousValue.unload();
		}
		//Latest value might be empty
		if (latestValue) {			
			app.log(['loading campaign', latestValue.id()]);

			//Trying to add .done() here errors, no idea why
			latestValue.load();	
		}
	});

	return dataContext;
});