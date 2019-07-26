var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var profileSchema = new Schema({
    addressStreet: String,
    addressCity: String,
    addressRegion: String,
    addressCountry: String,
    addressPostal: String,
    photo: String, // URL to photo
    citizenship: String,
    passportNumber: String,
    passportPhoto: String, // URL to photo
    documents: [String], // array of URL to documents, visa, flights, etc
    financialCards: [String],
    medical: String
});

module.exports = profileSchema;