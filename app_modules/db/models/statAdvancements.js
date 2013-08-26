module.exports = function(db, models) {
	var setName = 'statAdvancements';

    var set = new db.Schema({
        //id and _id are creatd by the system
        characterId: db.Schema.Types.ObjectId,
        name: String,
        baseValue: Number,
        rank: Number,
        rank1Xp: Number,
        rank2Xp: Number,
        rank3Xp: Number,
        rank4Xp: Number
    });

    var childrenToCascade = [];
    set.methods.checkChildRemoveCascade = function(property) {
        return childToCascade.indexOf(property) !== -1;
    };

    // Ensure virtual fields are serialised.
    set.set('toJSON', { virtuals: true });
    
    //add the models to our simplified models collection
    models[setName] = db.model(setName, set);
};