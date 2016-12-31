var express = require('express');
var cors = require('cors');
var bodyParser = require("body-parser");
var app = express();
var nconf = require("nconf").argv().env();
if (nconf.get("NODE_ENV") == "dev") {
    console.log("Env is dev");
    nconf.file("env/dev.json");
}
var validator = require("./services/validatorService");
var constants = require("./common/constants");
var userService = require("./services/userService");
var postService = require("./services/postService");
var notificationService = require("./services/notificationService");
var mongoose = require("mongoose");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect(nconf.get("mongo_url")).then(function (err) {

    console.log("Connected to Db");
    app.post("/user/new", function (req, res) {
        var payload = req.body;
        if (!validator(constants.user, payload)) {
            res.status(400).send(constants.errors.unProccessableRequest);
        } else {
            userService.isRegisteredUser(payload.email).then(function (isRegistered) {
                if (isRegistered) {
                    console.log("Registered user");
                    return userService.getUsersWith(constants.userDocKeys.email, payload.email, true)
                } else {
                    return userService.createUser(payload);
                }
            }).then(function (userDoc) {
                if (Array.isArray(userDoc)) {
                    userDoc = userDoc[0];
                }
                res.status(200).send(userDoc[constants.userDocKeys._id]);
            }).catch(function (err) {
                console.log(err);
                return res.status(400).send(constants.errors.unProccessableRequest);
            });
        }
    });

    app.post("/user/login", function (req, res) {
        var payload = req.body;
        userService.getUsersWith(constants.userDocKeys.email, payload.email, true).then(function (users) {
            if (users.length == 1) {
                res.status(200).send(users[0][constants.userDocKeys._id]);
            } else if (users.length == 0) {
                res.status(404).send(constants.errors.notfound);
            } else {
                res.status(422).send(constants.errors.multipleUsers);
            }
        }).catch(function (err) {
            res.status(422).send(err);
        });
    });

    app.get("/posts", function (req, res) {
        // Returns first 250 the posts depending on search filter
        var searchKey = req.query.type;
        var searchValue = req.query.filter;
        postService.getPostsWith(searchKey, searchValue, false).then(function (posts) {
            res.status(200).send(posts);
        }).catch(function (err) {
            res.status(422).send(err);
        });
    });

    app.post("/post/new", function (req, res) {
        // Create a new post
        var payload = req.body;
        payload.uid = req.headers["authorization"];
        if (!validator(constants.post, payload)) {
            res.status(400).send(constants.errors.unProccessableRequest);
        } else {
            postService.createPost(payload).then(function (post) {
                res.status(200).send(post);
            }).catch(function (err) {
                res.status(422).send(err);
            });
        }
    });

    app.get("/alumni", function (req, res) {
        // Return all the alumni depending on search filter
        var searchKey = req.query.searchKey;
        var searchValue = req.query.filter;
        userService.getUsersWith(searchKey, searchValue, false).then(function (posts) {
            res.status(200).send(posts);
        }).catch(function (err) {
            res.status(422).send(err);
        });
    });

    app.get("/notifications", function (req, res) {
        // Return all notifications which are in progress sorted in descending order of timestamp
        notificationService.getNotificationsWith(constants.notificationKeys.responder, req.headers["authorization"], true)
            .then(function (notifications) {
                res.status(200).send(notifications);
            }).catch(function(err){
                res.status(422).send(err);
            });
    });

    app.put("/notification/response", function (req, res) {
        // Update the notification with nid with the responsder's response
        var payload = req.body;
        notificationService.respondToNotification(payload).then(function (notification) {
            res.status(200).send(notification);
        }).catch(function (err) {
            res.status(422).send(err);
        });
    });

    app.post("/notification/new", function (req, res) {
        // Create a new notification
        var payload = req.body;
        if (!validator(constants.notification, payload)) {
            res.status(400).send(constants.errors.unProccessableRequest);
        }
        userService.getUsersWith(constants.userDocKeys._id, payload.responder, true).then(function (users) {
            if (users.length > 0) {
                payload.requestor = req.headers["authorization"];
                payload.status = false;
                payload.isInProgress = true;
                payload.timeStamp = Date.now();
                notificationService.createNotification(payload).then(function (notification) {
                    res.status(200).send(notification);
                }).catch(function (err) {
                    res.status(422).send(err);
                });
            } else {
                res.status(404).send(constants.errors.alumniNotFound);
            }
        }).catch(function (err) {
            res.status(422).send(err);
        });

    });
});

module.exports = app;