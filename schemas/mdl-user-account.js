var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const claimSchema = new Schema({
	type: String,
	value: String,
}, {_id: false});

var userAccountSchema = new Schema({
	userName: {
		type: String,
		unique: true,
		// match: /^email$/, // TODO: probably better to do validation at frontend
	},
	fullName: String,
	password: {
		type: String,
		default: ''
	},
	statusActivated: {
		type: Boolean,
		default: false
	},
	statusLocked: {
		type: Boolean,
		default: false
	},
	roles: {
		type: [String],
		default: []
	},
	claims: {
		type: [claimSchema],
		default: []
	}
});

module.exports = userAccountSchema;