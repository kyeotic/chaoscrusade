define(['durandal/app', 'models/campaign', 'modules/dataContext', 'viewmodels/login'],
function(app, Campaign, dataContext, login) {

    var Welcome = function() {
        var self = this;

        self.campaigns = dataContext.campaigns;

        self.campaignEntry = ko.observable();

        self.addCampaign = function() {
            var campaign = {name: self.campaignEntry(), gmId: login.user().id() };
            self.campaigns.push(new Campaign(campaign));
            self.campaignEntry('');
        };

        self.deleteCampaign = function(campaign) {
        	self.campaigns.remove(campaign);
        };
    };
    
    return new Welcome();
});