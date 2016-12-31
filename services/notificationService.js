// Service to return users or create user or delete user
var NotificationSchema = require("./../models/notification");
var StringUtils = require("./../common/StringUtils");
var constants = require("./../common/constants")
var notificationService = {
    createNotification: function (doc) {
        var notificationDoc = new NotificationSchema.NotificationModel();
        Object.keys(doc).forEach(function (key) {
            notificationDoc[key] = doc[key];
        }, this);
        return notificationDoc.save();
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
        return NotificationSchema.NotificationModel.findOne({ "_id": response.nid }).exec().then(function (notification) {
            if (notification) {
                if (!notification.isInProgress) {
                    throw new Error(constants.errors.alreadyResponded);
                } else {
                    notification.isInProgress = false;
                    notification.status = response.status;
                    return notification.save();
                }
            } else {
                throw new Error(constants.errors.notificationNotFound);
            }
        }).catch(function(err){
            return err;
        });
    }
}

module.exports = notificationService;