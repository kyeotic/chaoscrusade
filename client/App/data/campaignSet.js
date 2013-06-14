define(['durandal/app', 'models/campaign', 'services/campaignService', 'modules/socket', 'data/cache'], 
function(app, Campaign, campaignService, socket, cache){

	var CampaignSet = function(initialSet) {
		var self = this;

		self.campaigns = ko.observableArray([]);

		//Load the set from the server
		campaignService.getCampaigns().then(function(response) {
			cache.campaigns.add(response.campaigns);
			self.campaigns.map(response.campaigns, Campaign);
		});

		//Add campaign from socket
		socket.on('campaignAdded', function(campaign) {
			cache.campaigns.push(campaign);
			self.campaigns.push(new Campaign(campaign))
		});

		//Remove campaign from socket
		socket.on('campaignRemoved', function(campaignId) {
			cache.removeCampaign(campaignId);
			var campaign = self.campaigns().find(function(c) { 
				return c.id() == campaignId;
			});
            self.campaigns.remove(campaign);
		});

		//TODO: FINISH THIS
		self.campaigns.subscribeArrayChanged(
			//Added
			function(newElement) {
				if (cache.findCampaign(newElement.id()))
					return; // We already have it on the server				
				campaignService.createCampaign(newElement)
					.then(function(response) {
						newElement.update(response);
					})
					.fail(app.log);
			},
			//Removed
			function(oldElement) {
				if (!cache.findCampaign(oldElement.id()))
					return; //Not in the cache, not on the server
				campaignService.deleteCampaign(oldElement.id());
			}
		);
	};

	return new CampaignSet().campaigns;
});