const _personnel = require('express').Router();
const m = require('../services/msc-personnel')();
const p = require('../services/passport-service');
const utils = require('../util');
let route = utils.ROUTES.PERSONNEL.PATH;

// TODO: re-think and validate http status codes

// TODO: for all routes, if an item or an array is returned, package the result
// as instructed by Peter using utils.package with corresponding routes

_personnel.get(route.GET_ALL, p.auth_guard, (req, res) => {
    m.getAll().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_personnel.get(route.GET_BY_FILTER, p.auth_guard, (req, res) => {
    // deserialize the query with atob
    let body = Buffer.from(req.params.serializedQuery, 'base64').toString();
    m.getByFilter(body).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_personnel.get(route.GET_ONE, p.auth_guard, (req, res) => {
    m.getOne(req.params.id).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_personnel.post(route.ADD, p.auth_guard, (req, res) => {
    m.add(req.body).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

_personnel.put(route.EDIT, p.auth_guard, (req, res) => {
    m.edit(req.body).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

// TODO: leave personnel as deactivated for now, consider add a delete route or
// after decision is made with business logic
_personnel.put(route.DEACTIVATE, p.auth_guard, (req, res) => {
    m.deactivate(req.body).then(() => {
        res.status(204).end();
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

module.exports = _personnel;