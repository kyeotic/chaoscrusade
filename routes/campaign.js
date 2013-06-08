module.exports = function(app) {
    
    var auth = app.tokenAuth;
    var Campaigns = app.db.Campaigns;
    
    app.put('/campaigns', auth.requireToken, function(req, res) {
        var item = req.body;
        Campaigns.create(item, function(error, campaign) {
            res.json(campaign);
        });
    });
    
    app.post('/login', function(req, res) {
        
        Campaigns.findOne({usernameLower: credentials.username.toLowerCase()}).exec(function(error, user) {
         
        });
    });
};