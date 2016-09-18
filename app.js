var express = require('express');
var fs = require('fs');
var logger = require('./libs/logger');
var content = require('./domain/content');

var app = express();
var LOG_LEVELS = logger.LOG_LEVELS;
// TODO: This can cause content.js miss its debug prints. Should pass log level as arg to require logger.js instead.
//setTimeout(function() {logger.setLogLevel(process.env.LOG_LEVEL)}, 250);
logger.setLogLevel(process.env.LOG_LEVEL);

var plugins = JSON.parse(fs.readFileSync('public/json/plugins.json'));

app.set('port', process.env.PORT || 8080);
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));

if (app.get('env') === 'development') {
    logger.log("HTML pretty format enabled", LOG_LEVELS.DEBUG);
    app.locals.pretty = true;
}

app.get('/', function(req, res) {
    content.getHomeData(function(homeData) {
        res.render('home', {homeData: homeData});
    });
});

app.get('/donate', function(req, res) {
    res.render('donate', {donate: content.getDonate()});
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

app.get('/api/home', function(req, res) {
    if (!req.xhr) return next();

    content.getHomeData(function(homeData) {
        res.json(homeData);
    });
});

app.listen(app.get('port'), function() {
    logger.log("Node app is running at localhost:" + app.get('port'));
    logger.log("Environment is '" + app.get('env') + "'");
    logger.log("Logging level is '" + logger.getCurrentLogLevelName() + "'");
});