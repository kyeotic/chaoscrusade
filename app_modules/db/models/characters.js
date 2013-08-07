module.exports = function(db, models) {
	var setName = 'characters';

	var set = new db.Schema({
		name: String,
		campaignId: { type: db.Schema.Types.ObjectId, ref: 'campaigns'},
		ownerId: { type: db.Schema.Types.ObjectId, ref: 'users'},
		weaponSkill: Number,
		ballisticSkill: Number,
		strength: Number,
		toughness: Number,
		agility: Number,
		intelligence: Number,
		perception: Number,
		willpower: Number,
		fellowship: Number,
		infamy: Number,
		wounds: Number,
		corruption: Number,
		skills: [{ type: db.Schema.Types.ObjectId, ref: 'skills'}]
	});

    var childrenToCascade = []; //none yet
    set.methods.checkChildRemoveCascade = function(property) {
        return childToCascade.indexOf(property) !== -1;
    };

	// Ensure virtual fields are serialised.
	set.set('toJSON', { virtuals: true });

	//add the models to our simplified models collection
    models[setName] = db.model(setName, set);
};