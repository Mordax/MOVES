const _userAccount = require('express').Router();
var m = require('../services/msc-user-account')();
const utils = require('../util');
const p = require('../services/passport-service');

var jwt = require('jsonwebtoken');

let route = utils.ROUTES.USER_ACCOUNT.PATH;

// TODO: re-think and validate http status codes

/**
 * DEV_ONLY: to view all content from user-accounts collection
 */
_userAccount.get(route.ALL_USERS, p.auth_guard, p.claim_guard, (req, res) => {
	m.userAccountViewAll().then((data) => {
		res.set({'Content-Type': 'application/json'}).status(200).send(JSON.stringify(data, null, 2));
	}).catch((msg) => {
		res.status(400).json({message: msg});
	});
})

_userAccount.post(route.CREATE, (req, res) => {
	m.userAccountCreate(req.body).then((data) => {
		res.json({'message': data});
	})
	.catch((msg) => {
		res.status(400).json({'message': msg});
	});
});

_userAccount.post(route.LOGIN, (req, res) => {
	m.userAccountLogin(req.body)
		.then((data) => {
			let now = Date.now();
			let exp = Math.round(now / 1000) + utils.JWTEXPIRY;
			// After a successful login, send a token back to frontend
			// for future uses
			var payload = {
				iss: utils.JWTISSUER, // Issuer
				exp: exp, // Expiration time
				// sub: '', // Subject
				// aud: '', // Audience
				// nbf: '', // Not before
				// iat: '', // Issued at
				// jti: '', // JWT ID
				//_id: data._id,
				userName: data.userName,
				fullName: data.fullName,
				roles: data.roles,
				claims: data.claims,
			}
			var token = jwt.sign(payload, utils.JWTSECRET);
			
			res.json({'message': 'Login successful', token: token});
		})
		.catch((msg) => {
			res.status(400).json({'message': msg});
		});
});

_userAccount.put(route.ACTIVATE, (req, res) => {
	m.userAccountActivate(req.body)
		.then((data) => {
			res.json({'message': data});
		})
		.catch((msg) => {
			res.status(400).json({'message': msg});
		});
})

_userAccount.put(route.PASSWORD_CHANGE, p.auth_guard, (req, res) => {
	m.userAccountPasswordChange(req.body)
		.then((data) => {
			res.json({'message': data});
		})
		.catch((msg) => {
			res.status(400).json({'message': msg});
		});
});

// please ensure 'claims' field is of shape [{string: string}, ...]
_userAccount.put(route.ADD_CLAIMS, p.auth_guard, p.claim_guard, (req, res) => {
	m.userAccountAddClaim(req.body)
		.then((data) => {
			res.json({'message': data});
		})
		.catch((msg) => {
			res.status(400).json({'message': msg});
		});
});

// Reset user claims to a new given set of claims
_userAccount.put(route.RESET_CLAIMS, p.auth_guard, p.claim_guard, (req, res) => {
	m.userAccountReset(req.body)
		.then((data) => {
			res.json({'message': data});
		})
		.catch((msg) => {
			res.status(400).json({'message': msg});
		});
});

module.exports = _userAccount;