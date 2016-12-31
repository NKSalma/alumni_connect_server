var validatorService = function(modelType, doc) {
    if(modelType == "user") {
        if(!doc || !doc.email || !doc.firstName || !doc.lastName || !doc.phone 
        || !doc.qualification || !doc.currentLocation || !doc.passedOutYear) {
            return false;
        } 
    } else if(modelType == "notification") {
        if(!doc || !doc.responder){
            return false;
        }
    } else if(modelType == "post") {
        if(!doc || !doc.type || !doc.content) {
            return false;
        }
    }
    return true;
}

module.exports = validatorService;