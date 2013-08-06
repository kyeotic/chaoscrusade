module.exports = function(app) {   
    var auth = app.tokenAuth;
    var Campaigns = app.db.campaigns;


    app.get('/campaigns', auth.requireToken, function(req, res) {
        var skip = req.query.skip || 0;
        Campaigns.find().skip(skip).limit(10).exec(function(error, campaigns){

            //get the count as well, so users can next() if needed
            Campaigns.count().exec(function(countError, count) {
                res.json({campaigns: campaigns, count: count});
            });
        });
    });
    
    app.put('/campaigns', auth.requireToken, function(req, res) {
        var item = req.body;
        console.log(item);
        Campaigns.create(item, function(error, campaign) {
            if (!error) {
                res.json(campaign);
                app.sockets.broadcast(req.socketId, 'campaignAdded', campaign);
            } else {
                console.log("save error", error);
                res.send(500, "Error saving campaign");
            }
        });
    });

    app.delete('/campaigns/:id', auth.requireToken, function(req, res) {

        var id = req.params.id;
        Campaigns.remove({ _id: id}, function(error) {
            if (!error) {
                res.json(true);
                app.sockets.broadcast(req.socketId, 'campaignRemoved', id);
            }
            else {
                console.log("delete error", error);
                res.send(500, "Error deleting campaign");
            }
        });
    });
};