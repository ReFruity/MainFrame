function padWithZero(number) {
    return number < 10 ? '0' + number : number;
}

// Formats date as YYYY-MM-DD HH:MM:SS
var format = function(date) {
    var year = date.getFullYear();
    var month = padWithZero(date.getMonth() + 1);
    var day = padWithZero(date.getDate());

    var hour = padWithZero(date.getHours());
    var minutes = padWithZero(date.getMinutes());
    var seconds = padWithZero(date.getSeconds());

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
};

// Formats date as DD.MM.YYYY
var formatRussianDate = function(date) {
    var day = padWithZero(date.getDate());
    var month = padWithZero(date.getMonth() + 1);
    var year = date.getFullYear();

    return day + '.' + month + '.' + year;
};

var newDate = function() {
    return format(new Date());
};

exports.format = format;
exports.formatRussianDate = formatRussianDate;
exports.newDate = newDate;