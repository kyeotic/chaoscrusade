define(['durandal/app', 'knockout', 'data/dataContext'], 
function(app, ko, dataContext) {
	var CampaignPage = function() {
		var self = this;

		self.activate = function(campaignId) {
			app.log('campaign page activating', arguments);
			dataContext.selectCampaign(campaignId);
		};
	};

	return new CampaignPage();
});