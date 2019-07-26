const _content = require('express').Router();
var m = require('../services/msc-content');
const p = require('../services/passport-service');
const utils = require('../util');
let route = utils.ROUTES.CONTENT.PATH;

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
        filtered = data.map(c => {
            if (c.visibility.length == 0) {
                return c;
            }
        });
    }
    return filtered;
}

_content.get(route.GET_ALL, p.protective_guard, p.claim_guard, (req, res) => {
    m.getAll().then((data) => {
        res.send(filterByUserSetting(data));
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_content.get(route.GET_BY_FILTER, (req, res) => {
    let body = Buffer.from(req.params.serializedQuery, 'base64').toString();
    m.getByFilter(body).then((data) => {
        res.send(filterByUserSetting(data));
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_content.get(route.GET_ONE, (req, res) => {
    m.getOne(req.params._id).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_content.post(route.ADD, (req, res) => {
    m.add(req.body).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_content.put(route.EDIT, (req, res) => {
    m.edit(req.body).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_content.put(route.DEACTIVATE, (req, res) => {
    m.deleteOrDeactivate(req.body).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

module.exports = _content;