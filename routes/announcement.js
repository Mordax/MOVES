const _announcement = require('express').Router();
const m = require('../services/msc-announcement');
const utils = require('../util');
const p = require('../services/passport-service');

let route = utils.ROUTES.ANNOUNCEMENT.PATH;

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

_announcement.get(route.GET_ACTIVE, p.protective_guard, (req, res) => {
    m.getAllActive().then((data) => {
        res.send(filterByUserSetting(req.user, data));
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_announcement.get(route.GET_BY_FILTER, p.protective_guard, (req, res) => {
    let body = Buffer.from(req.params.serializedQuery, 'base64').toString();
    m.getByFilter(body).then((data) => {
        res.send(filterByUserSetting(data));
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_announcement.get(route.GET_ONE, p.protective_guard, (req, res) => {
    m.getOne(req.params._id).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_announcement.post(route.ADD, (req, res) => {
    m.add(req.body).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_announcement.put(route.EDIT, (req, res) => {
    m.edit(req.body).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_announcement.put(route.DEACTIVATE, (req, res) => {
    m.deleteOrDeactivate(req.body).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

module.exports = _announcement;