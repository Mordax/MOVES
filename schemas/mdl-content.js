var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contentSchema = new Schema({
    slug: String,
    language: String,
    timestamp: String,
    visibility: {
        type: [String],
        default: []
    },
    /**
     * the "content" for text-content is 
     *   - a piece of html to be served directly to the client
     * 
     * the "content" for media-content can be
     *   - absent if the content is only 1 file
     *   - a piece of html that contains the media file and to be served to the client
     */
    content: String,

    // path and fileName will be empty for text-content
    // both will only be used if content is media file
    path: {
        type: String,
        default: ""
    },
    fileName: {
        type: String,
        default: ""
    }

});

module.exports = contentSchema;