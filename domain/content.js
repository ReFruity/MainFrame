var dbConnection = require('../libs/db-connection');
var dateUtil = require('../libs/date-util');
var logger = require('../libs/logger');
var util = require('util');

var LOG_LEVELS = logger.LOG_LEVELS;
var news = {};
var rules = {};

dbConnection.query('SELECT id, date, heading, content FROM news ORDER BY date DESC', function(error, rows, fields) {
    handleError(error);
    logMySQLResultWithDebugLevel('News', rows);

    news = rows;
    formatNewsDates();
});

function formatNewsDates() {
    for (var i in news) {
        news[i].date = dateUtil.formatRussianDate(news[i].date);
    }
}

dbConnection.query('SELECT id, `index`, name, has_penalty FROM rule_category ORDER BY `index`', function(error, rows, fields) {
    handleError(error);
    logMySQLResultWithDebugLevel('Categories', rows);

    rules.categories = rows;
    convertFieldsToBoolean();
    rules.byCategory = [];

    for (var i in rows) {
        queryRulesByCategory(i, rows[i]);
    }
});

function convertFieldsToBoolean () {
    for (var i in rules.categories) {
        var category = rules.categories[i];
        var buffer = category.has_penalty;
        category.has_penalty = (Boolean)(buffer.readInt8(0));
    }
}

function queryRulesByCategory(index, category) {
    dbConnection.query('SELECT id, `index`, content, penalty FROM rule WHERE category_id = ? ORDER BY `index`',
        [category.id],
        function(error, rows, fields) {
            handleError(error);
            logMySQLResultWithDebugLevel('Rules sorted by categories [' + index + ']', rows);

            rules.byCategory[index] = rows;
        }
    );
}

dbConnection.query('SELECT id, content FROM rule_note', function(error, rows, fields) {
    handleError(error);
    logMySQLResultWithDebugLevel('Notes', rows);

    rules.notes = rows;
});

function handleError(error) {
    if (error) {
        logger.log(error, LOG_LEVELS.ERROR);
        throw error;
    }
}

function logMySQLResultWithDebugLevel(name, rows) {
    // TODO: Test if callback is called when LOG_LEVEL < DEBUG (it shouldn't be)
    logger.log(function() { return '[MySQL query result] ' + name + ': \n' + util.inspect(rows) }, LOG_LEVELS.DEBUG);
}

exports.getNews = function() {
    return news;
};

exports.getRules = function() {
    return rules;
};