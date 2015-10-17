var mysql = require('mysql');

var connection = mysql.createConnection({
    host    : 'localhost',
    user    : process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DATABASE
});

module.exports = connection;
