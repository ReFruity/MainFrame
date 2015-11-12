var format = function(date) {
    // TODO: Format date correctly
    //return date.toISOString();
    return date;
};

var newDate = function() {
    return format(new Date());
};

exports.format = format;
exports.newDate = newDate;