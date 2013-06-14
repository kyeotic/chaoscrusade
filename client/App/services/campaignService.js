define(['modules/serviceBase'], function(serviceBase) {
	return {
		createCampaign: function(campaign){
			return serviceBase.put('/campaigns', campaign);
		},
		getCampaigns: function(skip) {
			return serviceBase.get('/campaigns', { skip: skip || 0 });
		},
		deleteCampaign: function(campaignId) {
			return serviceBase.remove('/campaigns/' + campaignId);
		}
	};
});