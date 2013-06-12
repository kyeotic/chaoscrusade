define(['durandal/app', 'durandal/events', 'modules/serviceBase'],
function(app, Events, serviceBase) {

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
	
	app.log(dataContext.campaignAdded);
	dataContext.campaignAdded.then(function() {
		app.log('successful add event')
	});

	//Setup trigger proxies
	//Mainly for use by socket.io for publishing
	//Call with dataContext.raise.addCampaign(args)
	dataContext.raise = {
		campaignAdded: dataContext.proxy('campaignAdded'),
		campaignRemoved: dataContext.proxy('campaignRemoved')
	};

	return dataContext;
});