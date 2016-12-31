var mongoose = require("mongoose");
var NotificationSchema = new mongoose.Schema({
    requestor: {type: String, required: true},
    responder: {type: String, required: true},
    status: {type: Boolean, required: true},
    timeStamp:{type: Number, required: true},
    isInProgress: {type: Boolean, required: true}
});

exports.NotificationModel = mongoose.model("Notification", NotificationSchema);
