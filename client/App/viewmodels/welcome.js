define(['durandal/app', 'models/campaign', 'modules/dataContext', 'durandal/events'],
function(app, Campaign, dataContext, Events) {

    var Welcome = function() {
        var self = this;

        self.campaigns = ko.observableArray();
        self.campaignCount = ko.observable();

        self.campaignEntry = ko.observable();
        self.addCampaign = function() {
        	dataContext.createCampaign({ name: self.campaignEntry() })
        		.then(function(response) {
        			self.campaigns.push(new Campaign(response));
                    self.campaignCount(self.campaignCount() + 1);
        			self.campaignEntry('');
        		}).fail(app.log).done();
        };

        self.deleteCampaign = function(campaign) {
        	dataContext.deleteCampaign(campaign.id())
        		.then(function(response) {
        			self.campaigns.remove(campaign);
                    self.campaignCount(self.campaignCount() - 1);
        		}).fail(app.log).done();
        };

        dataContext.getCampaigns()
	        .then(function(response) {
	        	self.campaigns.map(response.campaigns, Campaign);
	        	self.campaignCount(response.count);
	        }).fail(app.log).done();

    };
    
    return new Welcome();
});