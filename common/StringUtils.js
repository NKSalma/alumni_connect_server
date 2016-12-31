var StringUtil =  {
    generateRandomString: function(length) {
        return Math.random().toString(36).substring(length);
    }
};

module.exports = StringUtil;