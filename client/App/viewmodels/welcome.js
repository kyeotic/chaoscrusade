define(['durandal/app', 'models/campaign', 'modules/dataContext', 'durandal/events'],
function(app, Campaign, dataContext, Events) {

    var Welcome = function() {
        var self = this;

        self.campaigns = dataContext.campaigns;

        self.campaignEntry = ko.observable();

        self.addCampaign = function() {
            self.campaigns.push(new Campaign(campaign));
        };

        self.deleteCampaign = function(campaign) {
        	self.campaigns.remove(campaign);
        };
    };
    
    return new Welcome();
});