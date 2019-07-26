const mongoose = require('mongoose');
const utils = require('../util');
// I donno if these 2 are needed yet so I added them
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

module.exports = function() {
    return {
        connect: function() {
            return new Promise( (resolve, reject) => {
                mongoose.connect(utils.CONNECTION_STRING, utils.CONNECTION_OPTIONS, (error) => {
                    reject(error);
                });
                mongoose.connection.once('open', () => {
                    resolve();
                });
            });
        }
    }
}
