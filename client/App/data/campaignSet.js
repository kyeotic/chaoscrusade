define(['durandal/app', 'knockout', 'models/campaign', 'services/campaignService', 'modules/socket', 'data/cache'], 
function(app, ko, Campaign, campaignService, socket, cache){

	cache.createSet("campaigns", '_id');
	var campaignSet = {};

	campaignSet.campaigns = ko.observableArray([]);

	//Load the set from the server
	campaignService.getCampaigns().then(function(response) {
		cache.campaigns.add(response.campaigns);
		campaignSet.campaigns.map(response.campaigns, Campaign);
	});

	//Add campaign from socket
	socket.on('campaignAdded', function(campaign) {
		cache.campaigns.push(campaign);
		campaignSet.campaigns.push(new Campaign(campaign))
	});

	//Remove campaign from socket
	socket.on('campaignRemoved', function(campaignId) {
		cache.campaigns.remove(campaignId);
		var campaign = campaignSet.campaigns().find(function(c) { 
			return c.id() == campaignId;
		});
        campaignSet.campaigns.remove(campaign);
	});

	campaignSet.campaigns.subscribeArrayChanged(
		//Added
		function(newElement) {
			if (cache.campaigns.find(newElement.id()))
				return; // We already have it on the server				
			campaignService.createCampaign(newElement)
				.then(function(response) {
					newElement.update(response);
				})
				.fail(app.log);
		},
		//Removed
		function(oldElement) {
			if (!cache.campaigns.find(oldElement.id()))
				return; //Not in the cache, not on the server
			campaignService.deleteCampaign(oldElement.id());
		}
	);

	return campaignSet;
});