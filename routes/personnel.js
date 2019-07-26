const _personnel = require('express').Router();
const m = require('../services/msc-personnel')();
const p = require('../services/passport-service');
const utils = require('../util');
let route = utils.ROUTES.PERSONNEL.PATH;

_personnel.get(route.GET_ALL, p.auth_guard, (req, res) => {
    m.getAll().then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_personnel.get(route.GET_BY_FILTER, p.auth_guard, (req, res) => {
    // deserialize the query with atob
    let body = Buffer.from(req.params.serializedQuery, 'base64').toString();
    m.getByFilter(body).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_personnel.get(route.GET_ONE, p.auth_guard, (req, res) => {
    m.getOne(req.params._id).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_personnel.post(route.ADD, p.auth_guard, (req, res) => {
    m.add(req.body).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_personnel.put(route.EDIT, p.auth_guard, (req, res) => {
    m.edit(req.body).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

// TODO: discuss with Peter if user info are to be deleted permanently or simply deactivated
_personnel.put(route.DEACTIVATE, p.auth_guard, (req, res) => {
    m.deleteOrDeactivate(req.body).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

module.exports = _personnel;