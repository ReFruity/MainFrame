var mysql = require('mysql');
var logger = require('./logger');

var connection = mysql.createConnection({
    host    : 'localhost',
    user    : process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DATABASE
});

connection.connect(function(error) {
    if (error) {
        logger.log(
            'Cannot connect to database "' + process.env.DATABASE +
            '" as user "' + process.env.DBUSER +
            '"\n' + error.stack,
            logger.LOG_LEVELS.ERROR);
        throw error;
    }
});

module.exports = connection;
