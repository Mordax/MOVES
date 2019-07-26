var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mediaContentSchema = new Schema({
    slug: String,
    timestamp: Date,
    visibility: {
        type: [String],
        default: []
    },

    fileName: String,
    URI: String
});

module.exports = mediaContentSchema;