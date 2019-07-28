const mongoose = require('mongoose');

const contentSchema = require('../schemas/mdl-content');

module.exports = function () {
    let db = mongoose.connection;
    let Content = db.model('content', contentSchema, 'content');

    return {
        getAll: function () {
			return new Promise((resolve, reject) => {
				Content.find()
					.sort({ timestamp: 'desc' })
					.exec((error, items) => {
						if (error) {
							return reject({ 'message': error.message });
						}
						if (items) {
							return resolve(items);
						} else {
							return reject('Cannot retrieve contents');
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
				Content.find(filter)
					//.sort()
					.exec((error, items) => {
						if (error) {
							return reject({'message': error.message});
						}
						if (items) {
							// TODO: assume for now that we dont need to format our returns
							return resolve(items);
						} else {
							return reject({'message': 'Can\'t find content information with given filters'});
						}
					})

			});
        },
        
        getOne: function (contentId) {
			return new Promise((resolve, reject) => {
				Content.findById(contentId, (error, item) => {
					if (error) {
						return reject({'message' : error.message});
					}
					if (item) {
						return resolve(item);
					} else {
						return reject('Cannot find content with given id');
					}
				});
			});
		},

		add: function (data) {
			return new Promise((resolve, reject) => {
				// TODO: add new content object checks here
				let newContent = new Content(data);
				Content.create(newContent,
					(error, item) => {
					if (error) {
						if (error.code == 11000) {
							return reject("Content already exists");
						} else {
							return reject(`Content creation failed - ${error.message}`);
						}
					} else {
						return resolve(item);
					}
				})
			});
		},

		edit: function (data) {
			return new Promise((resolve, reject) => {
				Content.findByIdAndUpdate(
					data._id,
					data,
					{ new: true },
					(error, item) => {
						if (error) {
							return reject(`Unable to edit content - ${error.message}`);
						}
						if (item) {
							return resolve(item);
						} else {
							return reject('Cannot update content')
						}
					}
				);
			});
		},

		delete: function (id) {
			return new Promise((resolve, reject) => {
				Content.findByIdAndRemove(id,
					(error) => {
						if (error) {
							return reject(`Unable to deactivate content - ${error.message}`);
						}
						return resolve();
					}
				);
			});
		},
    }
}