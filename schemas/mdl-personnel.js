var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var personnelSchema = new Schema({
    userName: String,
    familyName: String,
    givenName: String,
    jobTitle: String,
    dateStarted: String,
    dateTermination: String,
    phoneOffice: String,
    phoneMobile: String,
    phoneDevice: String,
    organization: String,
    supervisor: String,
    locationCountry: String,
    locationLocal: String,
    // ----------------------------------------
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
    medical: String,
});

module.exports = personnelSchema;