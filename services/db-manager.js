const mongoose = require('mongoose');
const utils = require('../util');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

module.exports = function() {
    return {
        connect: function() {
            return new Promise( (resolve, reject) => {
                mongoose.connect(utils.CONNECTION_STRING, utils.CONNECTION_OPTIONS, (error) => {
                    reject(error);
                });
                // Since require('mongoose') resolves a singleton object
                // Once connected, call 'mongoose.connection' in other msc-* managers
                // will return the current connection
                mongoose.connection.once('open', () => {
                    resolve();
                });
            });
        }
    }
}
