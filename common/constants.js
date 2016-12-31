var constants = {
    user: "user",
    notification: "notification",
    post: "post",
    userDocKeys: {
        firstName: "firstName",
        lastName: "lastName",
        dob: "dob",
        email: "email",
        phone: "phone",
        currentOccupation: "currentOccupation",
        occupationHistory: "occupationHistory",
        experience: "experience",
        passedOutYear: "passedOutYear",
        qualification: "qualification",
        homeTown: "homeTown",
        currentLocation: "currentLocation",
        designation: "designation",
        _id: "_id"
    },
    notificationKeys: {
        responder: "responder"
    },
    errors: {
        unAuthorized: "You are not authorized to perform this operation. Contact our support",
        unProccessableRequest: "We are not able to process your request. Kindly try again",
        multipleUsers: "Found duplicate users. Contact support.",
        notfound: "There is no registered user with this email",
        alumniNotFound: "No such user exists in this group.",
        notificationNotFound: "No such notification exists in our database",
        alreadyResponded: "You have already responded to this request"
    }
}

module.exports = constants