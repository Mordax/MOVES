const mongoose = require('mongoose');

const personnelSchema = require('../schemas/mdl-personnel');
// const profileSchema = require('../schemas/profile');

module.exports = function () {
	let db = mongoose.connection;
	let Personnel = db.model('personnel', personnelSchema, 'personnel');

	return {
		getAll: function (userData) {
			return new Promise((resolve, reject) => {
				Personnel.find()
					.sort({ familyName: 'asc', givenName: 'asc' })
					.exec((error, items) => {
						if (error) {
							return reject({ 'message': error.message });
						}
						if (items) {
							return resolve(items);
						} else {
							return reject('Cannot retrieve personnel information');
						}
					});
			});
		},

		getByFilter: function (userData) {
			return new Promise((resolve, reject) => {
				// TODO: For now, assume that userData is all we have for the filter part
				// may change to userData.condition, depends on frontend logic
				let filter = userData;
				// let filter = userData.condition;
				Personnel.find(filter)
					//.sort()
					.exec((error, items) => {
						if (error) {
							return reject({'message': error.message});
						}
						if (items) {
							// TODO: assume for now that we dont need to format our returns
							return resolve(items);
						} else {
							return reject({'message': 'Can\'t find personnel information with given filters'});
						}
					})
			});
		},

		getOne: function (userId) {
			return new Promise((resolve, reject) => {
				Personnel.findById(userId, (error, item) => {
					if (error) {
						return reject({'message' : error.message});
					}
					if (item) {
						return resolve(item);
					} else {
						return reject('Cannot find personnel with given id');
					}
				});
			});
		},

		add: function (userData) {
			return new Promise((resolve, reject) => {
				// TODO: add new personnel object checks here
				let newPersonnel = new Personnel(userData);
				newPersonnel.save((error) => {
					if (error) {
						if (error.code == 11000) {
							return reject("Personnel already exists");
						} else {
							return reject(`Personnel creation failed - ${error.message}`);
						}
					} else {
						return resolve("Added new personnel");
					}
				});
			});
		},

		edit: function (userData) {
			return new Promise((resolve, reject) => {
				Personnel.findOneAndUpdate(
					{ userName: userData.userName },
					userData,
					{ new: true },
					(error, item) => {
						if (error) {
							return reject(`Unable to edit personnel - ${error.message}`);
						}
						if (item) {
							return resolve('Personnel has been updated successfully');
						} else {
							return reject('Cannot update personnel')
						}
					}
				);
			});
		},

		deleteOrDeactivate: function (userData) {
			return new Promise((resolve, reject) => {
				Personnel.findOneAndUpdate(
					{ userName: userData.userName },
					{ dateTermination: new Date().toISOString() },
					{ new: true },
					(error, item) => {
						if (error) {
							return reject(`Unable to deactivate personnel - ${error.message}`);
						}
						if (item) {
							return resolve('Personnel has been deactivated');
						} else {
							return reject('Cannot deactivate personnel');
						}
					}
				);
			});
		},
	}
}