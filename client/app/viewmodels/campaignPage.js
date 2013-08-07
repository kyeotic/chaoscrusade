define(['durandal/app', 'knockout', 'data/dataContext', 'viewmodels/login', 'models/character'], 
function(app, ko, dataContext, login, Character) {
	var CampaignPage = function() {
		var self = this;

		self.activate = function(campaignId) {
			app.log('campaign page activating', arguments, dataContext.campaigns().length);
			dataContext.selectCampaign(campaignId);
			app.log(dataContext.selectedCampaign().characters());
		};

		self.campaign = dataContext.selectedCampaign;

		self.addCharacter = ko.command({
			execute: function() {
				var character = new Character({ 
					name: login.loggedInUser().username(),
					campaignId: self.campaign().id(),
					ownerId: login.loggedInUser().id()
				});
				self.campaign().characters.push(character);
			}
		});
	};

	return new CampaignPage();
});