define(['durandal/app', 'knockout', 'models/campaign', 'data/dataContext', 'viewmodels/login' , 'plugins/router'],
function(app, ko, Campaign, dataContext, login, router) {

    var Welcome = function() {
        var self = this;

        self.campaigns = dataContext.campaigns;

        self.campaignEntry = ko.observable();

        self.addCampaign = function() {
            var campaign = { name: self.campaignEntry(), gmId: login.user().id() };
            self.campaigns.push(new Campaign(campaign));
            self.campaignEntry('');
        };

        self.deleteCampaign = function(campaign) {
        	self.campaigns.remove(campaign);
        };

        self.selectCampaign = function(campaign) {
            var result = router.navigate('#campaign/' + campaign.id());
            app.log(result);
        };
    };
    
    window.welcome = new Welcome();
    return window.welcome;
});