var dateUtil = require('./date-util');

var LOG_LEVELS = {
    FATAL: 1,
    ERROR: 2,
    WARN: 3,
    INFO: 4,
    DEBUG: 5,
    TRACE: 6,
    properties: {
        1: {name: 'FATAL'},
        2: {name: 'ERROR'},
        3: {name: 'WARN'},
        4: {name: 'INFO'},
        5: {name: 'DEBUG'},
        6: {name: 'TRACE'}
    }
};

var DEFAULT_LOG_LEVEL = LOG_LEVELS.INFO;
var CURRENT_LOG_LEVEL = getLogLevelByName(process.env.LOG_LEVEL);

function getLogLevelByName(name) {
    if (!name) {
        return DEFAULT_LOG_LEVEL;
    }

    for (var i in LOG_LEVELS.properties) {
        if (LOG_LEVELS.properties[i].name == name) {
            return i;
        }
    }

    throw 'Log level "' + name + '" does not exist. Please change your LOG_LEVEL environment variable.';
}

var shouldLog = function(logLevel) {
    return logLevel <= CURRENT_LOG_LEVEL;
};

/*
    First argument: message string or function, returning message string
    Second argument: one of logger.LOG_LEVELS.*
 */
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

        console.log('[' + dateUtil.newDate() + '][' + LOG_LEVELS.properties[logLevel].name + '] ' + message);
    }
};

exports.LOG_LEVELS = LOG_LEVELS;
exports.CURRENT_LOG_LEVEL_NAME = LOG_LEVELS.properties[CURRENT_LOG_LEVEL].name;
exports.log = log;
