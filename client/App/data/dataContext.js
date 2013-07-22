define(['data/socketObservable', 'models/campaign'],
function(SocketObservable, Campaign) {
	var dataContext = {
		campaigns: new SocketObservable('campaign', Campaign),
		skills: new SocketObservable('skill', )
	};
});