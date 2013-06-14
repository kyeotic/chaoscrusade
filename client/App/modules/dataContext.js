define(['durandal/app', 'data/campaignSet'],
function(app, CampaignSet) {

	return {
		campaigns: new CampaignSet().campaigns
	};
});