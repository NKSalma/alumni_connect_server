// Service to return users or create user or delete user
var UserSchema = require("./../models/user");
var StringUtils = require("./../common/StringUtils");
var constants = require("./../common/constants")
var userService = {
    createUser: function (doc) {
        var userDoc = new UserSchema.UserModel();
        Object.keys(doc).forEach(function (key) {
            userDoc[key] = doc[key];
        }, this);
        return userDoc.save();
    },
    getUsersWith: function (key, val, isValueComplete) {
        var searchObj = {};
        if (key) {
            if (isValueComplete) {
                searchObj[key] = val;
            } else {
                searchObj[key] = { $regex: new RegExp(".*" + val + ".*", "i") };
            }
        }
        return UserSchema.UserModel.find(searchObj).limit(250).exec();
    },
    isRegisteredUser: function (email) {
        return userService.getUsersWith(constants.userDocKeys.email, email, true).then(function (usersList) {
            if (usersList.length > 0) {
                return true;
            }
            return false;
        });
    }
}

module.exports = userService;