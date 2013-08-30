module.exports = function(db, models) {
	var setName = 'skillAdvancements';

    var set = new db.Schema({
        //id and _id are creatd by the system
        characterId: db.Schema.Types.ObjectId,
        skillId: db.Schema.Types.ObjectId,

        rank: Number,
        xpSpent: [Number]
    });

    var children = [];
    set.methods.shouldDeleteChild = function(property) {
        return children.indexOf(property) !== -1;
    };

    // Ensure virtual fields are serialised.
    set.set('toJSON', { virtuals: true });
    
    //add the models to our simplified models collection
    models[setName] = db.model(setName, set);
    models[setName].children = children;
};