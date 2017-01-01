// Service to return users or create user or delete user
var NotificationSchema = require("./../models/notification");
var StringUtils = require("./../common/StringUtils");
var constants = require("./../common/constants");
var Q = require("q");
var notificationService = {
    createNotification: function (doc) {
        var d = Q.defer();
        var notificationDoc = new NotificationSchema.NotificationModel();
        Object.keys(doc).forEach(function (key) {
            notificationDoc[key] = doc[key];
        }, this);
        var searchObj = {};
        searchObj[constants.notificationKeys.requestor] = doc[constants.notificationKeys.requestor];
        searchObj[constants.notificationKeys.responder] = doc[constants.notificationKeys.responder];
        NotificationSchema.NotificationModel.find(searchObj).exec()
            .then(function (notifications) {
                if (notifications.length > 0) {
                    notifications.forEach(function (notification) {
                        if (notification[constants.notificationKeys.isInProgress]) {
                            d.reject(constants.errors.alreadyRequested);
                            return d.promise;
                        } else if (notification[constants.notificationKeys.status]) {
                            d.reject(constants.errors.alreadyConnected);
                            return d.promise;
                        }
                    }, this);
                    notificationDoc.save().then(function (notification) {
                        d.resolve(notification);
                    }).catch(function (err) {
                        d.reject(err);
                    })
                } else {
                    notificationDoc.save().then(function (notification) {
                        d.resolve(notification);
                    }).catch(function (err) {
                        d.reject(err);
                    })
                }
            });

        return d.promise;
    },
    getNotificationsWith: function (key, val, isValueComplete) {
        var searchObj = {};
        if (isValueComplete) {
            searchObj[key] = val;
        } else {
            searchObj[key] = { $regex: new RegExp(".*" + val + ".*", "i") };
        }
        searchObj.isInProgress = true;
        return NotificationSchema.NotificationModel.find(searchObj).limit(250).exec();
    },
    respondToNotification: function (response) {
        var d = Q.defer();

        NotificationSchema.NotificationModel.findOne({ "_id": response.nid }).exec().then(function (notification) {
            if (notification) {
                if (!notification.isInProgress) {
                    d.reject(constants.errors.alreadyResponded);
                } else {
                    notification.isInProgress = false;
                    notification.status = response.status;
                    return notification.save();
                }
            } else {
                d.reject(constants.errors.notificationNotFound);
            }
        }).then(function (notification) {
            d.resolve(notification);
        }).catch(function (err) {
            if (err && err.name && err.name == constants.errorCode.mongooseCastError) {
                d.reject(constants.errors.notificationNotFound);
            } else {
                d.reject(err);
            }
        });

        return d.promise;
    }
}

module.exports = notificationService;