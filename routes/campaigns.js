module.exports = function(app) {   
    var auth = app.tokenAuth;
    var Campaigns = app.db.Campaigns;

    app.io.sockets.on('connection', function(socket) {
        console.log(app.io.sockets);
        console.log(socket);
        socket.emit('test', { });
    });

    app.io.sockets.on('disconnect', function(socket) {
        console.log("Socket Disconnected");
        console.log(socket);
    });
    
    app.put('/campaigns', auth.requireToken, function(req, res) {
        var item = req.body;
        Campaigns.create(item, function(error, campaign) {
            res.json(campaign);
        });
    });

    app.get('/campaigns', auth.requireToken, function(req, res) {
        var skip = req.query.skip || 0;
        Campaigns.find().skip(skip).limit(10).exec(function(error, campaigns){

            //get the count as well, so users can next() if needed
            Campaigns.count().exec(function(countError, count) {
                res.json({campaigns: campaigns, count: count});
            });
        });
    });

    app.delete('/campaigns/:id', auth.requireToken, function(req, res) {
        var id = req.params.id;
        Campaigns.remove({ _id: id}, function(error) {
            if (!error)
                res.json(true);
            else
                res.json(false);
        });
    });
};