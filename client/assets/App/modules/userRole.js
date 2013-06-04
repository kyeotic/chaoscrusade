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
        swAdmin: [
            //Navs
            new Route('home', 'viewmodels/welcome', true),
            new Route('hdoadmin', 'viewmodels/adminhdoPage', true),
            new Route('msvadmin', 'viewmodels/adminmsv', true)
            //Routes
        ],
        hdoAdmin:[
            //Navs
            new Route('home', 'viewmodels/welcome', true),
            new Route('facilities', 'viewmodels/facilities', true),
            //Routes
            new Route('facilityedit', 'viewmodels/facilityEdit', false)
        ],
        hdoUser: [
        ],
        msvAdmin: [
        
        ],
        msvUser: [
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