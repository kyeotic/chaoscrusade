define(['data/socketObservable', 'models/campaign', 'models/skill'],
function(SocketObservable, Campaign, Skill) {
	var dataContext = {
		campaigns: new SocketObservable('campaign', Campaign),
		skills: new SocketObservable('skill', Skill)
	};
});