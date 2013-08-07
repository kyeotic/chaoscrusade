module.exports = function(db, models) {
	var setName = 'skills';

    var set = new db.Schema({
        //id and _id are creatd by the system
        name: String,
        text: String,
        page: Number,
        alignment: String,
        characteristic: String
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