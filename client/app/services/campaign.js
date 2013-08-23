define(['services/http'], function(http) {
	return {
		createCampaign: function(campaign){
			return http.put('/campaigns', campaign);
		},
		getCampaigns: function(skip) {
			return http.get('/campaigns', { skip: skip || 0 });
		},
		deleteCampaign: function(campaignId) {
			return http.remove('/campaigns/' + campaignId);
		}
	};
});