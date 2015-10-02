var dateUtil = require('./date-util.js');

var log = function(message) {
    console.log(dateUtil.newDate() + ': ' + message);
};

exports.log = log;