const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const userAccountSchema = require('../schemas/mdl-user-account');
const utils = require('../util');

module.exports = function () {
	let db = mongoose.connection;
	let UserAccounts = db.model('userAccount', userAccountSchema, 'user-account');

	return {
		/**
		 * userData has shape of userAccountSchema with extra field "passwordConfirm"
		 */
		userAccountCreate: function (userData) {
			return new Promise((resolve, reject) => {
				// User need to have a matching password
				if (userData.password != userData.passwordConfirm) {
					return reject('Password does not match with confirmted.');
				}
				
				// User need to have at least 1 claim
				if (userData.claims.length == 0) {
					return reject('User need to have at least 1 claim.');
				}

				// User need to have at least 1 role and they all have to be one of pre-defined roles
				let roles = Object.values(utils.ROLES);

				if (userData.roles.length == 0) {
					return reject('User need to have at least 1 role.');
				}

				for (var i = 0, len = userData.roles.length; i < len; i++) {
					if (!roles.includes(userData.roles[i])) {
						return reject(`Role ${userData.roles[i]} is not supported`);
					}
				}
				
				// If passed user info is correct, salt and hash the password
				var salt = bcrypt.genSaltSync(10);
				var hash = bcrypt.hashSync(userData.password, salt);
				userData.password = hash;

				let newUser = new UserAccounts(userData);

				newUser.save((error) => {
					if (error) {
						if (error.code == 11000) {
							reject("User account creation - cannot create; User exists");
						} else {
							reject(`User account creation - ${error.message}`);
						}
					} else {
						resolve("User account creation successful");
					}
				});
			});
		},

		// userData will include userName field as string
		userAccountLogin: function (userData) {
			return new Promise((resolve, reject) => {
				UserAccounts.findOne(
					{ userName: userData.userName },
					(error, item) => {
						if (error) {
							return reject(`Login - ${error.message}`);
						}
						if (item) {
							let isPasswordMatch = bcrypt.compareSync(userData.password, item.password);
							if (isPasswordMatch) {
								return resolve(item);
							} else {
								return reject('Login was not successful');
							}
						} else {
							return reject('Login - not found');
						}
					}
				);
			});
		},

		userAccountActivate: function(userData) {
			return new Promise((resolve, reject) => {

			});
		},

		userAccountPasswordChange: function (userData) {
			return new Promise((resolve, reject) => {
				if (userData.newPassword != userData.newPasswordConfirm) {
					return reject('Password does not match with confirmted');
				}
				
				var salt = bcrypt.genSaltSync(10);
				var hash = bcrypt.hashSync(userData.newPassword, salt);

				UserAccounts.findOne(
					{ userName: userData.userName },
					(error, item) => {
						if (error) {
							return reject('You are not in the system.');
						}
						if (item) {
							let isPasswordMatch = bcrypt.compareSync(userData.password, item.password);
							if (isPasswordMatch) {
								UserAccounts.findOneAndUpdate(
									{ userName: userData.userName },
									{ password: hash },
									{ new: true },
									(error, item) => {
										if (error) {
											//return reject(`Password change failed - ${error.message}`);
											return reject(`Password change failed - please confirm your username.`);
										}
										if (item) {
											return resolve('Password change successful.');
										} else {
											return reject('Password change failed.');
										}
									}
								);
							} else {
								return reject('You have entered the wrong password.');
							}
						}
					}
				);

			});
		},

		userAccountAddClaim: function (userData) {
			return new Promise((resolve, reject) => {
				// Change claim format to our own claim format with {type: key, value: value}
				// let newClaims = userData.claims.map(c => {
				// 	let key = Object.keys(c)[0];
				// 	let value = c[key];
				// 	return {type: key, value: value};
				// });

				UserAccounts.findOneAndUpdate(
					{ userName: userData.userName },
					{ $push : { "claims": userData.claims }},
					{ new: true },
					(error, item) => {
						if (error) {
							//return reject(`Password change failed - ${error.message}`);
							return reject(`Unable to add claim - ${error.message}`);
						}
						
						if (item) {
							return resolve('Claims successfully added.');
						} else {
							return reject('Unable to add claim.');
						}
					}
				);
			});
		},

		userAccountReset: function (userData) {
			return new Promise((resolve, reject) => {
				UserAccounts.findOneAndUpdate(
					{ userName: userData.userName },
					{ $set : { "claims" : userData.claims } },
					{ new: true},
					(error, item) => {
						if (error) {
							return reject(`Unable to reset - ${error.message}`);
						}

						if (item) {
							return resolve('Claims are successfully set to new values.');
						} else {
							return reject('Unable to reset.');
						}
					}
				);
			});
		},

		userAccountViewAll: function() {
			return new Promise((resolve, reject) => {
				UserAccounts.find().exec((error, items) => {
					if (error) {
						return reject({ message: error.message });
					}
					if (items) {
						return resolve(items);
					} else {
						return reject({ message: 'Unable to retrieve user account collection'});
					}
				});
			})
		}
	}
}