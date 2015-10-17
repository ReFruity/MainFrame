var express = require('express');
var fs = require('fs');
var logger = require('./libs/logger');
var content = require('./domain/content');

var app = express();
var LOG_LEVELS = logger.LOG_LEVELS;

var plugins = JSON.parse(fs.readFileSync('public/json/plugins.json'));

app.set('port', process.env.PORT || 8080);
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));

if (app.get('env') === 'development') {
    logger.log("HTML pretty format enabled", LOG_LEVELS.DEBUG);
    app.locals.pretty = true;
}

app.get('/', function(req, res) {
    res.render('home', {news: content.getNews()});
});

app.get('/donate', function(req, res) {
    res.render('donate');
});

app.get('/contact', function(req, res) {
    res.render('contact');
});

app.get('/rules', function(req, res) {
    res.render('rules', {rules: content.getRules()});
});

app.get('/plugins', function(req, res) {
    res.render('plugins', {plugins: plugins});
});

app.listen(app.get('port'), function() {
    logger.log("Node app is running at localhost:" + app.get('port'));
    logger.log("Environment is '" + app.get('env') + "'");
    logger.log("Logging level is '" + logger.CURRENT_LOG_LEVEL_NAME + "'");
});