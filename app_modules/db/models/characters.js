module.exports = function(db, models) {
	var setName = 'characters';

	var set = new db.Schema({
		name: String,
		campaignId: { type: db.Schema.Types.ObjectId, ref: 'campaigns'},
		playerId: { type: db.Schema.Types.ObjectId, ref: 'users'},
		infamy: Number,
		wounds: Number,
		woundsRemaining: Number,
		corruption: Number,
		xpGained: Number,

		//Computed
		//xpRemaining: Number,

		skillAdvancements: [{ type: db.Schema.Types.ObjectId, ref: 'skillAdvancements'}],
		statAdvancements: [{ type: db.Schema.Types.ObjectId, ref: 'statAdvancements'}]
	});

	//Owned reference sets
    var children = ['skillAdvancements', 'statAdvancements'];
    set.methods.checkChildRemoveCascade = function(property) {
        return children.indexOf(property) !== -1;
    };

	// Ensure virtual fields are serialised.
	set.set('toJSON', { virtuals: true });

	//add the models to our simplified models collection
    models[setName] = db.model(setName, set);
    models[setName].children = children;
};