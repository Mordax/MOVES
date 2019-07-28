const _announcement = require('express').Router();
const m = require('../services/msc-announcement')();
const utils = require('../util');
const p = require('../services/passport-service');

let route = utils.ROUTES.ANNOUNCEMENT.PATH;

// TODO: re-think and validate http status codes

// TODO: for all routes, if an item or an array is returned, package the result
// as instructed by Peter using utils.package with corresponding routes

/**
 * TODO: update filter condition and algorithm
 * 
 * the filterByUserSetting function does filter the fetched result
 * based on "visibility" setting of each content
 * 
 * If the user is undefined(meaning the user is unauthorized), the user
 * can only view items with "visibility" being empty array
 * 
 * Else, the user has to have at least one "role" exists in the
 * "visibility" array
 * 
 * TODO: consider generalize this function and move to "util.js"
 */
function filterByUserSetting (user, data) {
    var filtered = [];
    if (user) {
        let userRoles = user.roles;
        filtered = data.map(c => {
            for(var i = 0, l = c.visibility.length; i++; i < l) {
                if (userRoles.findIndex(role => role === c.visibility[i]) != -1)
                    return c;
            }
        });
    } else {
        filtered = data.filter(c => c.visibility.length == 0);
    }
    return filtered;
}

/**
 * TODO: add following logics to GET_ALL, GET_BY_FILTER, GET_ONE routes
 * For GET_ALL, GET_BY_FILTER, GET_ONE routes
 * If the result set after filter by user roles is empty
 * Return 401 with corresponding unauthorized message
 */
_announcement.get(route.GET_ACTIVE, p.protective_guard, (req, res) => {
    m.getAllActive().then((data) => {
        res.json(filterByUserSetting(req.user, data));
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_announcement.get(route.GET_BY_FILTER, p.protective_guard, (req, res) => {
    let body = Buffer.from(req.params.serializedQuery, 'base64').toString();
    m.getByFilter(body).then((data) => {
        res.json(filterByUserSetting(data));
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_announcement.get(route.GET_ONE, p.protective_guard, (req, res) => {
    m.getOne(req.params.id).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_announcement.post(route.ADD, (req, res) => {
    m.add(req.body).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_announcement.put(route.EDIT, (req, res) => {
    m.edit(req.body).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_announcement.put(route.DELETE, (req, res) => {
    m.delete(req.params.id).then(() => {
        res.status(204).end();
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

module.exports = _announcement;