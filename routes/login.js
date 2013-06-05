module.exports = function(app) {
    var hasher = app.hasher;
    var Users = app.db.Users;
    
    var isUsernameAvailable = function(username, callback) {
        Users.count({username: username}, function(err, count) {
            callback(count == 0);
        });
    };
    
    app.get('/checkUsernameAvailable/:username', function(req, res) {
        isUsernameAvailable(req.params.username, function(canUse) {
            res.json(canUse);
        });
    });
    
    app.post('/login', function(req, res) {
        var credentials = req.body.credentials;
        
        Users.findOne({username: credentials.username}).exec(function(error, user) {
            console.log(user);
        });
        
        var result = hasher.verify(credentials.password, user.passwordHash);
        delete user.password;
        
        if(result == hasher.results.failed) {
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
        console.log(item);
        isUsernameAvailable(item.username, function(canUse) {
            if (!canUse) {
              res.send(403, "Username is in use");
              res.end();
            } else {
                item.role = "user"; //Only one user type currently
        
                //Get a real password
                try {
                    item.passwordHash = app.hasher.generate(item.password);
                } catch (e) {
                    res.send(400, "Bad password entry");
                    res.end();
                }
                Users.create(item, function(error, user) {
                    delete user.passwordHash;
                    console.log(user);
                    console.log(app.tokenAuth.generateUserToken(user));
                    res.json({ user: user, token: app.tokenAuth.generateUserToken(user) });
                });
            }
        });
    });
};