define(['durandal/app', 'knockout', 'models/campaign', 'data/dataContext', 'login/login' , 'plugins/router'],
function(app, ko, Campaign, dataContext, login, router) {

    var Welcome = function() {
        var self = this;

        self.campaigns = dataContext.campaigns;

        self.campaignEntry = ko.observable();

        self.addCampaign = function() {
            var campaign = { 
                name: self.campaignEntry(),
                gmId: login.user().id(),
                gmUsername: login.user().username()
            };
            self.campaigns.push(new Campaign(campaign));
            self.campaignEntry('');
        };

        self.deleteCampaign = function(campaign) {
        	self.campaigns.remove(campaign);
        };

        self.selectCampaign = function(campaign) {
            app.log('navigating');
            //router.navigate('campaign/' + campaign.id());
            router.navigate('campaign/' + campaign.id(), true);
        };
    };
    
    window.welcome = new Welcome();
    return window.welcome;
});