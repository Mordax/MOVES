var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var textContentSchema = new Schema({
    slug: String,
    language: String,
    timestamp: Date,
    visibility: {
        type: [String],
        default: []
    },
    content: String
});

module.exports = textContentSchema;