define(['data/socketObservable', 'models/campaign', 'models/skill'],
function(socketObservable, Campaign, Skill) {
	var dataContext = {
		campaigns: new socketObservable.Set('campaign', Campaign),
		skills: new socketObservable.Set('skill', Skill)
	};

	dataContext.campaigns.getSet().then(function(response) {
		console.log(response);
	});

	return dataContext;
});