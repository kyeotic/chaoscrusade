module.exports = function(app) {
    var hasher = app.hasher;
    var Users = app.db.Users;
    
    app.post('/login', function(req, res) {
        var credentials = req.body.credentials;
        
        Users.findOne({userName: credentials.userName}).exec(function(error, user) {
            console.log(user);
        });
        
        var result = hasher.verify(credentials.password, user.passwordHash);
        delete user.password;
        
        if(result == hasher.results.failed){
            res.json(false);
        } else {
            //update hash if needed
            if (result == hasher.results.passedNeedsUpdate) {
                user.password = hasher.generate(user.password);
                store.save();
            }
            
            var token = app.tokenAuth.generateUserToken(user);
            res.json({ user: user, token: token });
        }
    });
    
    app.put('/login', function(req, res) {
        var item = req.body;
        
        //Get a real password
        item.passwordHash = app.hasher.generate(item.password);
        Users.create(item, function(error, user) {
            delete user.passwordHash;
            res.json(user);
        });
    };
};