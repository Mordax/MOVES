var passport = require('passport');
const utils = require('../util');

let auth_guard = passport.authenticate('jwt', { session: false });

let protective_guard = function(req, res, next) {
    if (req.headers.authorization)
        passport.authenticate('jwt', { session: false })(req, res, next);
    else
        next();
};

// TODO: improve this generalized claim guard
// this need business logic consideration for conditions
let claim_guard = function(req, res, next) {
    // When protective_guard passin a non-user
    if (req.user === undefined || req.user === null) {
        next();
        return;
    }

    // When protective_guard / auth_guard passin a good-user
    let path = req.baseUrl + req.route.path;
    let allowedRoles = utils.FULL_PATHS[path].ROLES;
    let allowedClaims = utils.FULL_PATHS[path].CLAIMS;

    let userRoles = req.user.roles;
    let userClaims = req.user.claims;

    // console.log('Allow claims');
    // console.log(allowedClaims);
    // console.log('Allow roles');
    // console.log(allowedRoles);

    // console.log('User claims');
    // console.log(userClaims);
    // console.log('User roles');
    // console.log(userRoles);

    let userProcessAllRoles = true;
    let userProcessAllClaims = true;

    for (var i = 0, l = allowedClaims.length; i < l; i++) {
        if (userClaims.findIndex(claim => claim.type === allowedClaims[i].type && claim.value === allowedClaims[i].value) == -1)
            userProcessAllClaims = false;
    }

    for (var i = 0, l = allowedRoles.length; i < l; i++) {
        if (userRoles.findIndex(role => role === allowedRoles[i]) == -1)
            userProcessAllRoles = false;
    }

    // console.log("User has all claim");
    // console.log(userProcessAllClaims);
    // console.log("User has all role");
    // console.log(userProcessAllRoles);

    if (allowedRoles.length == 0 && allowedClaims.length == 0) {
        next();
        return;
    } else if (allowedRoles.length == 0) {
        if (userProcessAllClaims) { next(); return; }
    } else if (allowedClaims.length == 0) {
        if (userProcessAllRoles) { next(); return; }
    } else {
        if (userProcessAllClaims && userProcessAllRoles) { next(); return; }
    }

    res.status(401).json({message:'User does not process valid claims or roles'});

}

module.exports = {
    auth_guard,
    claim_guard,
    protective_guard,
}