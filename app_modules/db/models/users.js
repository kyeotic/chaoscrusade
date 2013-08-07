module.exports = function(db, models) {
    var setName = 'users';

    var set = new db.Schema({
        //id and _id are creatd by the system
        firstName: String,
        lastName: String,
        username: String,
        usernameLower: String,
        passwordHash: String,
        role: String
    });

    var childrenToCascade = [];
    set.methods.checkChildRemoveCascade = function(childModel) {
        return childToCascade.indexOf(childModel) !== -1;
    };

    // Ensure virtual fields are serialised.
    set.set('toJSON', { virtuals: true });
    
    //add the models to our simplified models collection
    models[setName] = db.model(setName, set);
};