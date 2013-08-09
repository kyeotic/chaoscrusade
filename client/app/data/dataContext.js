define(['knockout', 'durandal/app', 'models/campaign', 'models/skill'],
function(ko, app, Campaign, Skill) {

	var dataContext = {
		//Sets
		campaigns: ko.socketSet('campaigns', Campaign),
		skills: ko.socketSet('skills', Skill),

		//Properties
		selectedCampaign: ko.observable()
	};

	dataContext.alignments = [
		'Khorne',
		'Tzeentch',
		'Nurgle',
		'Slaanesh',
		'Unaligned'
	];

	dataContext.characteristics = [
		'Weapon Skill',
		'Ballistic Skill',
		'Strength',
		'Toughness',
		'Agility',
		'Intelligence',
		'Perception',
		'Willpower',
		'Fellowship'
	];

	dataContext.load = function() {
		return app.deferAll([ //This really is an array, stop "fixing" it
			dataContext.campaigns.loadSet(),
			dataContext.skills.loadSet()
		]).fail(function() {
			app.log('dataContext failed to load');
		});
	};

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

	window.dataContext = dataContext;

	return dataContext;
});