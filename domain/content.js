var dbConnection = require('../libs/db-connection');
var dateUtil = require('../libs/date-util');
var logger = require('../libs/logger');
var util = require('util');

var LOG_LEVELS = logger.LOG_LEVELS;
var news = {};
var rules = {};
var donate = {};

//region news

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

//endregion news

//region rules

// Backticks are necessary here because 'index' is a reserved word in MySQL
// https://dev.mysql.com/doc/refman/5.5/en/keywords.html
dbConnection.query('SELECT id, `index`, name, has_penalty FROM rule_category ORDER BY `index`', function(error, rows, fields) {
    handleError(error);
    logMySQLResultWithDebugLevel('Categories', rows);

    rules.categories = rows;
    convertRulesCategoriesHasPenaltyToBoolean();
    // TODO: Rename rules.byCategoryIndex
    rules.byCategory = [];

    for (var i in rows) {
        queryRulesByCategoryIndex(i, rows[i]);
    }
});

function convertRulesCategoriesHasPenaltyToBoolean () {
    for (var i in rules.categories) {
        var category = rules.categories[i];
        var buffer = category.has_penalty;
        category.has_penalty = (Boolean)(buffer.readInt8(0));
    }
}

function queryRulesByCategoryIndex(index, category) {
    dbConnection.query('SELECT id, `index`, content, penalty FROM rule WHERE category_id = ? ORDER BY `index`', [category.id],
        function(error, rows, fields) {
            handleError(error);
            logMySQLResultWithDebugLevel('Rules sorted by category index [' + index + ']', rows);

            rules.byCategory[index] = rows;
        }
    );
}

dbConnection.query('SELECT id, content FROM rule_note', function(error, rows, fields) {
    handleError(error);
    logMySQLResultWithDebugLevel('Notes', rows);

    rules.notes = rows;
});

//endregion rules

//region donate

dbConnection.query('SELECT id, name FROM donate_group', function(error, rows, fields) {
    handleError(error);
    logMySQLResultWithDebugLevel('Donate groups', rows);

    donate.groups = rows;
});

queryDonatePrices();

function queryDonatePrices() {
    dbConnection.query('SELECT id, group_id, feature_id, month, forever FROM donate_price', function(error, rows, fields) {
        handleError(error);
        logMySQLResultWithDebugLevel('Donate prices', rows);

        fillDonatePricesByGroupId(rows);
    });
}

function fillDonatePricesByGroupId(prices) {
    donate.pricesByGroupId = [];

    for (var i in prices) {
        if (prices[i].group_id) {
            donate.pricesByGroupId[prices[i].group_id] = prices[i];
        }
    }

    logger.log(function() { return 'Filled donate.pricesByGroupId: \n' + util.inspect(donate.pricesByGroupId) }, LOG_LEVELS.DEBUG)
}

dbConnection.query('SELECT id, `index`, description, code FROM donate_feature ORDER BY `index`', function(error, rows, fields) {
    handleError(error);
    logMySQLResultWithDebugLevel('Donate features', rows);

    donate.features = rows;
    queryDonateAdjacency();
});

function queryDonateAdjacency() {
    dbConnection.query('SELECT collation_id, feature_id, group_id FROM donate_group_and_feature', function(error, rows, fields) {
        handleError(error);
        logMySQLResultWithDebugLevel('Donate group and feature', rows);

        fillDonateAdjacencyTable(rows);
    });
}

function fillDonateAdjacencyTable(rows) {
    donate.adjacencyTable = [];

    for (var i in donate.features) {
        donate.adjacencyTable[donate.features[i].id] = [];
    }

    for (var i in rows) {
        donate.adjacencyTable[rows[i].feature_id][rows[i].group_id] = true;
    }

    logger.log(function() { return 'Filled donate.adjacencyTable: \n' + util.inspect(donate.adjacencyTable) }, LOG_LEVELS.DEBUG)
}

dbConnection.query('SELECT id, service, account_id FROM donate_account_details', function(error, rows, fields) {
    handleError(error);
    logMySQLResultWithDebugLevel('Donate account details', rows);

    donate.accountDetails = rows;
});

//endregion donate

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

exports.getDonate = function() {
    return donate;
};