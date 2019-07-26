var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var announcementSchema = new Schema({
    shortName: String,
    category: String,
    dateCreated: String,
    dateExpired: String,
    targetCountry: String,
    targetRegion: String,
    visibility: {
        type: [String],
        default: [],
    },
    content: String
});

module.exports = announcementSchema;