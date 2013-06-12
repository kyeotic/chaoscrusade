define(['durandal/app', 'durandal/events', 'serviceBase'],
function(app, Events, campaignService) {

	var dataContext = {
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

	//Setup events
	Events.includeIn(dataContext);

	//Setup subscribables
	//call with dataContext.campaignAdded().then(function(args) {})
	dataContext.campaignAdded = dataContext.on('campaignAdded');
	dataContext.campaignRemoved = dataContext.on('campaignRemoved');
	
	//Setup trigger proxies
	//Mainly for use by socket.io for publishing
	//Call with dataContext.raise.addCampaign(args)
	dataContext.raise = {
		addCampaign: dataContext.proxy('campaignAdded'),
		removeCampaign: dataContext.proxy('campaignRemoved')
	};

	return dataContext;
});