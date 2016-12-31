var mongoose = require("mongoose");
var PostSchema = new mongoose.Schema({
    type: {type: String, required: true},
    content: {type: String, required: true},
    uid: {type: String, required: true},
    timeStamp:{type: Number, required: true}
});

exports.PostModel = mongoose.model("Post", PostSchema);
