define(['durandal/app', 'models/campaign', 'modules/dataContext', 'durandal/events'],
function(app, Campaign, dataContext, Events) {

    var Welcome = function() {
        var self = this;

        self.campaigns = ko.observableArray();
        self.campaignCount = ko.observable();

        self.campaignEntry = ko.observable();

        var addCampaign = function(campaign) {
            self.campaigns.push(new Campaign(campaign));
            self.campaignCount(self.campaignCount() + 1);
        };
        self.addCampaign = function() {
        	dataContext.createCampaign({ name: self.campaignEntry() })
        		.then(function(response) {
        			addCampaign(response);
        			self.campaignEntry('');
        		}).fail(app.log).done();
        };
        //Register for updates
        dataContext.campaignAdded.then(addCampaign);

        self.deleteCampaign = function(campaign) {
        	dataContext.deleteCampaign(campaign.id())
        		.then(function(response) {
        			self.campaigns.remove(campaign);
                    self.campaignCount(self.campaignCount() - 1);
        		}).fail(app.log).done();
        };
        //Register for updates
        //Removal has to work by reference, so external removal requires an id
        dataContext.campaignRemoved.then(function(campaignId) {
            var campaign = self.campaigns().find(function(c) { return c.id() == campaignId;});
            self.campaignCount(self.campaignCount() - 1);
            self.campaigns.remove(campaign);
        });        

        dataContext.getCampaigns()
	        .then(function(response) {
	        	self.campaigns.map(response.campaigns, Campaign);
	        	self.campaignCount(response.count);
	        }).fail(app.log).done();

    };
    
    return new Welcome();
});