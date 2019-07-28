const mongoose = require('mongoose');

const announcementSchema = require('../schemas/mdl-announcement');

module.exports = function () {
    let db = mongoose.connection;
    let Announcement = db.model('announcement', announcementSchema, 'announcement');
    return {

        getAllActive: () => {
            return new Promise((resolve, reject) => {
				Announcement.find()
					.sort({ shortName: 'asc' })
					.exec((error, items) => {
						if (error) {
							return reject({ 'message': error.message });
						}
						if (items) {
							return resolve(items);
						} else {
							return reject('Cannot retrieve announcement information');
						}
					});
			});
        },

        getByFilter: (data) => {
            return new Promise( (resolve, reject) => {
                let filter = data;
				// let filter = userData.condition;
				Announcement.find(filter)
					//.sort()
					.exec((error, items) => {
						if (error) {
							return reject({'message': error.message});
						}
						if (items) {
							// TODO: assume for now that we dont need to format our returns
							return resolve(items);
						} else {
							return reject({'message': 'Can\'t find announcement information with given filters'});
						}
					})
            });
        },

        getOne: (id) => {
            return new Promise( (resolve, reject) => {
                Announcement.findById(id, (error, item) => {
					if (error) {
						return reject({'message' : error.message});
					}
					if (item) {
						return resolve(item);
					} else {
						return reject('Cannot find announcement with given id');
					}
				});
            });
        },

        add: (data) => {
            return new Promise( (resolve, reject) => {
				let newAnnouncement = new Announcement(data);
				Announcement.create(newAnnouncement,
					(error, item) => {
					if (error) {
						if (error.code == 11000) {
							return reject("Announcement already exists");
						} else {
							return reject(`Announcement creation failed - ${error.message}`);
						}
					} else {
						return resolve(item);
					}
				});
            });
        },

        edit: (data) => {
            return new Promise( (resolve, reject) => {
                Announcement.findByIdAndUpdate(
					data._id,
					data,
					{ new: true },
					(error, item) => {
						if (error) {
							return reject(`Unable to edit announcement - ${error.message}`);
						}
						if (item) {
							return resolve('Announcement has been updated successfully');
						} else {
							return reject('Cannot update announcement')
						}
					}
				);
            });
        },

        delete: (id) => {
            return new Promise( (resolve, reject) => {
                Announcement.findByIdAndRemove(
					id,
					(error) => {
						if (error) {
							return reject(`Unable to remove announcement - ${error.message}`);
						}
						return resolve();
					}
				);
            });
        },
    }
}