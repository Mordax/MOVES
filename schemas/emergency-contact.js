var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var emergencySchema = new Schema({
    usage: String
});

module.exports = emergencySchema;