define(['plugins/router'], function(router) {
    
    var roles = {
        user: [
            //Navs
            { route: '', moduleId: 'viewmodels/welcome', title: 'Home', nav: true}
            
            //Routes
        ]
    };
    
    var setupRole = function(name) {
        var role = roles[name];

        if (role === undefined)
            return false;

        router.map(role).buildNavigationModel();

        return true;
    };
    
    return {
        setup: setupRole
    };
});