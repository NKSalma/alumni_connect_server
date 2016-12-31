var PostSchema = require("./../models/post");
var StringUtils = require("./../common/StringUtils");
var constants = require("./../common/constants")
var postService = {
    createPost: function (doc) {
        var postDoc = new PostSchema.PostModel();
        Object.keys(doc).forEach(function (key) {
            postDoc[key] = doc[key];
        }, this);
        postDoc.timeStamp = Date.now();
        return postDoc.save();
    },
    getPostsWith: function (key, val, isValueComplete) {
        var searchObj = {};
        if (key) {
            if (isValueComplete) {
                searchObj.type = key;
                searchObj.content = val;
            } else {
                searchObj.type = key;
                searchObj.content = { $regex: new RegExp(".*" + val + ".*", "i") };
            }
        }
        return PostSchema.PostModel.find(searchObj).sort({ timeStamp: -1 }).limit(250).exec();
    }
}

module.exports = postService;