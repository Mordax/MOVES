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

        getByFilter: (userData) => {
            return new Promise( (resolve, reject) => {
                let filter = userData;
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

        getOne: (userData) => {
            return new Promise( (resolve, reject) => {
                Announcement.findById(userId, (error, item) => {
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

        add: (userData) => {
            return new Promise( (resolve, reject) => {
                let newAnnouncement = new Announcement(userData);
				newAnnouncement.save((error) => {
					if (error) {
						if (error.code == 11000) {
							return reject("Announcement already exists");
						} else {
							return reject(`Announcement creation failed - ${error.message}`);
						}
					} else {
						return resolve("Added new announcement");
					}
				});
            });
        },

        edit: (userData) => {
            return new Promise( (resolve, reject) => {
                Announcement.findOneAndUpdate(
					{ userName: userData.shortName },
					userData,
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

        deleteOrDeactivate: (userData) => {
            return new Promise( (resolve, reject) => {
                Announcement.findOneAndUpdate(
					{ userName: userData.shortName },
					{ dateTermination: new Date().toISOString() },
					{ new: true },
					(error, item) => {
						if (error) {
							return reject(`Unable to deactivate announcement - ${error.message}`);
						}
						if (item) {
							return resolve('Announcement has been deactivated');
						} else {
							return reject('Cannot deactivate announcement');
						}
					}
				);
            });
        },
    }
}