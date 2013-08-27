module.exports = function(db, models) {
	var setName = 'campaigns';

    var set = new db.Schema({
        //id and _id are creatd by the system
        gmId: db.Schema.Types.ObjectId,
        gmUsername: String,
        name: String,
        characters: [{ type: db.Schema.Types.ObjectId, ref: 'characters' }]

        , items: [String] //Test data
    });

    //Servicebase needs a generic way to determine whether or not to delete
    //The referered document during removal of a child
    var childToCascade = ['characters'];
    set.methods.checkChildRemoveCascade = function(childModel) {
        return childToCascade.indexOf(childModel) !== -1;
    };

    // Ensure virtual fields are serialised.
	set.set('toJSON', { virtuals: true });
	    
    //add the models to our simplified models collection
    models[setName] = db.model(setName, set);
};