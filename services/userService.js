// Service to return users or create user or delete user
var UserSchema = require("./../models/user");
var StringUtils = require("./../common/StringUtils");
var constants = require("./../common/constants");
var NotificationSchema = require("./../models/notification");
var _ = require("lodash");
var Q = require("q");
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
    },
    updateConnectedUser: function (users, uid) {
        var d = Q.defer();

        _.remove(users, function (user) {
            return user[constants.userDocKeys._id] == uid;
        });
        var searchObj = {};
        searchObj[constants.notificationKeys.requestor] = uid;

        NotificationSchema.NotificationModel.find(searchObj).exec()
            .then(function (notifications) {
                users.forEach(function (user, i) {
                    var index = _.findIndex(notifications, function (notification) {
                        return notification[constants.notificationKeys.responder] == users[i][constants.userDocKeys._id]
                    });
                    if (index == -1) {
                        users[i][constants.userDocKeys.phone] = "";
                        users[i][constants.userDocKeys.email] = "";
                    } else if (notifications[index][constants.notificationKeys.isInProgress]) {
                        users[i][constants.userDocKeys.phone] = "";
                        users[i][constants.userDocKeys.email] = "";
                    } else if (!(notifications[index][constants.notificationKeys.status])) {
                        users[i][constants.userDocKeys.phone] = "";
                        users[i][constants.userDocKeys.email] = "";
                    }
                });
                d.resolve(users);
            }).catch(function (err) {
                d.reject(err);
            });

        return d.promise;
    }
}

module.exports = userService;