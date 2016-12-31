var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    dob: {type: String},
    email:{type: String, required: true},
    phone:{type: String, required: true},
    currentOccupation: {type: String},
    occupationHistory: [String],
    experience: {type: Number},
    passedOutYear: {type: Number, required: true},
    qualification: {type: String, require: true},
    homeTown: {type: String},
    currentLocation: {type: String, required: true},
    designation: {type: String}
});

exports.UserModel = mongoose.model("User", UserSchema);
