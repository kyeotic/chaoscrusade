define(['models/campaign', 'services/campaignService', 'modules/socket'], 
function(Campaign, campaignService, socket){

	var CampaignSet = function(initialSet) {
		var self = this;

		var campaignCache = [];
		self.campaigns = ko.observableArray();

		campaignService.getCampaigns().then(function(campaigns) {
			campaignCache = campaigns;
			self.campaigns.map(campaigns, Campaign);
		});

		.map(initialSet, Campaign);

		//Add campaign from socket
		socket.on('campaignAdded', function(campaign) {
			campaignCache.push(campaign);
			self.campaigns.push(new Campaign(campaign))
		});

		//Remove campaign from socket
		socket.on('campaignRemoved', function(campaignId) {
			campaignCache.remove(function(c) {
				return c._id == campaignId;
			});
			var campaign = self.campaigns().find(function(c) { 
				return c.id() == campaignId;
			});
            self.campaigns.remove(campaign);
		});

		//TODO: FINISH THIS
		self.campaigns.subscribeArrayChanged(
			//Added
			function(newElement) {

				var index = campaignCache.findIndex(function (c) {
					return c._id == newElement.id();
				});
				if (index > -1)
					return; //We already have it on the server
				
				campaignService.createCampaign(newElement);

			},
			//Removed
			function(oldElement) {

			}
		);

	};

	return CampaignSet;
});