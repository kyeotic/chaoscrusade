module.exports = function(requiredRoles, userRole) {
    requiredRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return function(req, res, next) {
        if (requiredRoles.contains(userRole)) {
            next();
        } else {
            res.send(401, "Insufficient Privileges");
            res.end();
        }
    };
};