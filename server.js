// System libs
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Import Routes
const _userAccount = require('./routes/user-account');
const _content = require('./routes/content');
const _personnel = require('./routes/personnel');
const _announcement = require('./routes/announcement');

// DB
const master = require('./services/db-manager')();
const utils = require('./util');

const app = express();
const HTTP_PORT = process.env.PORT || 9128;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Auth
var passport = require('passport');
var passportJWT = require('passport-jwt');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {};
jwtOptions.issuer = 'groupA.dps945.com';
//jwtOptions.passReqToCallback = true;
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");

jwtOptions.secretOrKey = utils.JWTSECRET;

var loggedInStrategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
	if (jwt_payload) {
		next(null, jwt_payload);
	} else {
		next(null, false);
	}
});

passport.use(loggedInStrategy);
app.use(passport.initialize());

// apply the routes
app.use(utils.ROUTES.USER_ACCOUNT.BASE_ROUTE , _userAccount);
app.use(utils.ROUTES.CONTENT.BASE_ROUTE, _content);
app.use(utils.ROUTES.PERSONNEL.BASE_ROUTE, _personnel);
app.use(utils.ROUTES.ANNOUNCEMENT.BASE_ROUTE, _announcement);

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "views/usage.html"));
});

app.use((req, res) => {
	res.status(404).send("Resource not found");
});

master.connect().then(() => {
	app.listen(HTTP_PORT, () => {
		console.log("Ready to LALALA on port " + HTTP_PORT);
	});
}).catch((err) => {
	console.log('Unable to start: ' + err);
});