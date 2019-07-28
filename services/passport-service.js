var passport = require('passport');
const utils = require('../util');

// Checks if incoming Authorization token is valid
// Will respond Unauthorized if token is invalid
let auth_guard = passport.authenticate('jwt', { session: false });

/**
 * Checks if incoming request contains an Authorization token
 * Yes:
 *  conitnue to validate Authorization token,
 *  respond with Unauthorized if token is invalid
 * No:
 *  continue as un-authorized user
 */
let protective_guard = function(req, res, next) {
    if (req.headers.authorization)
        passport.authenticate('jwt', { session: false })(req, res, next);
    else
        next();
};

/**
 * Check claims owned by user against claims required by route
 * 
 */
let claim_guard = function(req, res, next) {
    // req.user is only undefined when request does not include authorization token
    // content available to unauthorized user is limited and will be limited by corresponding routes
    if (req.user === undefined || req.user === null) {
        next();
        return;
    }

    // upon receiving an authorized user
    let path = req.baseUrl + req.route.path;
    let allowedClaims = utils.FULL_PATHS[path].CLAIMS;
    let userClaims = req.user.claims;
    let userProcessAllClaims = true;

    console.log(userClaims);

    // allow { 'OU': 'DevLead' } to bypass all claims check
    if (userClaims.findIndex(claim => claim.type === utils.CLAIMS.TYPES.OU && claim.value === utils.CLAIMS.OU.DevLead) != -1) {
        next();
        return;
    }

    for (var i = 0, l = allowedClaims.length; i < l; i++) {
        if (userClaims.findIndex(claim => claim.type === allowedClaims[i].type && claim.value === allowedClaims[i].value) == -1)
            userProcessAllClaims = false;
    }
    
    if (userProcessAllClaims) {
        next();
        return;
    } else {
        res.status(401).json({message:'User does not process valid claims'});
    }

}

module.exports = {
    auth_guard,
    claim_guard,
    protective_guard,
}