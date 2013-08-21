define(['durandal/app', 'knockout', 'data/dataContext', 'viewmodels/login', 
		'models/character', 'viewmodels/chatMessage'], 
function(app, ko, dataContext, login, Character, ChatMessage) {
	var CampaignPage = function() {
		var self = this;
		var childRouter = router.createChildRouter();

		self.activate = function(campaignId) {

			//Don't reactivate everything, its just a child route
			if (self.campaign().id() === campaignId)
				return;

			return dataContext.selectCampaign(campaignId)
				.then(function() {
					var route = 'campaign/' + campaignId;
					self.router = childRouter.reset()
						.makeRelative({
							moduleId: 'viewmodels/campaign',
							route: route
							//route: 'campaign/:id'
						}).map([
							{ route: '', moduleId: 'home', hash: '#' + route, title: 'Home', nav: true },
							{ route: 'settings', moduleId: 'settings', hash: '#' + route + '/settings', title: 'Settings', nav: true },
							{ route: 'character/:id', moduleId: 'characterPage', hash: '#' + route + '/character', nav: false }
						]).buildNavigationModel();
				});			
		};

		self.campaign = ko.computed(function() {
			return dataContext.selectedCampaign();
		});

		self.isGm = ko.computed(function() {
			return self.campaign().gmId() === login.loggedInUser().id();
		});

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

		self.deleteCharacter = function(character) {
			self.campaign().characters.remove(character);
			self.navHome();
		};

		//Nav
		self.characterHash = function(character) {
			return '#campaign/' + self.campaign().id() + '/character/' + character.id();
			app.log('nav mock to', character, self.campaign());
		};


		//Chat
		self.messageInput = ko.observable('');
		self.sendMessage = function(message) {
			self.campaign().chatMessages.push(new ChatMessage({text: self.messageInput()}));
			self.messageInput('');
		};
	};

	return new CampaignPage();
});