define(function() {
	var campaigns = [];
	var findCampaign = function(campaignId) {
		return campaigns.find(function(c) { 
			return c._id == campaignId; 
		});
	};
	var removeCampaign = function(campaignId) {
		var campaign = findCampaign(campaignId);
		if (campaign)
			return false;
		campaigns.remove(campaign);
		return true;
	};

	return {
		campaigns: campaigns,
		findCampaign: findCampaign,
		removeCampaign: removeCampaign
	}
});