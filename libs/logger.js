var dateUtil = require('./date-util');

var LOG_LEVELS = {
    FATAL:  0,
    ERROR:  1,
    WARN:   2,
    INFO:   3,
    DEBUG:  4,
    TRACE:  5
};

var DEFAULT_LOG_LEVEL = LOG_LEVELS.INFO;
var CURRENT_LOG_LEVEL = DEFAULT_LOG_LEVEL;

var log = function(data, logLevel) {
    if (!logLevel) {
        logLevel = DEFAULT_LOG_LEVEL;
    }

    if (shouldLog(logLevel)) {
        var message;

        if (typeof data == "function") {
            message = data();
        }
        else {
            message = data;
        }

        console.log('[' + dateUtil.newDate() + '][' + getKeyByValue(logLevel, LOG_LEVELS) + '] ' + message);
    }
};

var shouldLog = function(logLevel) {
    return logLevel <= CURRENT_LOG_LEVEL;
};

var getCurrentLogLevelName = function() {
    return getKeyByValue(CURRENT_LOG_LEVEL, LOG_LEVELS);
};

var setLogLevel = function(logLevel) {
    if (getKeyByValue(logLevel, LOG_LEVELS)) {
        CURRENT_LOG_LEVEL = logLevel;
    }
    else {
        CURRENT_LOG_LEVEL = parseLogLevel(logLevel);
    }
};

function getKeyByValue(value, object) {
    for (var key in object) {
        if (object[key] == value) {
            return key;
        }
    }
}

function parseLogLevel(name) {
    var parsedLogLevel = LOG_LEVELS[name];

    if (parsedLogLevel) {
        return parsedLogLevel;
    }
    else {
        throw 'Cannot parse log level "' + name + '". Should be string representing one of logger.LOG_LEVELS  keys.';
    }
}

exports.LOG_LEVELS = LOG_LEVELS;

/*
 First argument: message string or function, returning message string
 Second argument: one of logger.LOG_LEVELS.*
 */
exports.log = log;

/*
 Returns string representing current log level. E.g. "DEBUG" for LOG_LEVELS.DEBUG.
 */
exports.getCurrentLogLevelName = getCurrentLogLevelName;

/*
 Argument is one of logger.LOG_LEVELS or string to be parsed representing one of logger.LOG_LEVELS keys.
 */
exports.setLogLevel = setLogLevel;
