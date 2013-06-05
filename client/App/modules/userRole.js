define(['durandal/plugins/router', 'durandal/app'],
function(router, app) {
    
    var Route = function(name, viewModel, isNav) {
        this.name = name;
        this.module = viewModel;
        this.isNav = isNav || false;
    };
    
    Route.prototype.setup = function() {
        router.mapRoute(this.name, this.module, this.name, this.isNav);
    };
    
    var roles = {
        user: [
            //Navs
            new Route('home', 'viewmodels/welcome', true)
            
            //Routes
        ]
    };
    
    var setupRole = function(name) {
        var role = roles[name];
        if (role === undefined)
            return false;
        role.each(function(route) {
            route.setup();
        });
        console.log("routes setup");
        return true;
    };
    
    return {
        setup: setupRole
    };
});