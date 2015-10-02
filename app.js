var express = require('express');
var fs = require('fs');
var logger = require('./libs/logger.js');
var app = express();

var newsPath = 'public/json/news.json';
var news = JSON.parse(fs.readFileSync(newsPath));
var rules = JSON.parse(fs.readFileSync('public/json/rules.json'));
var plugins = JSON.parse(fs.readFileSync('public/json/plugins.json'));

// TODO: Move to library
fs.watch(newsPath, 
    function (event, filename) {
        logger.log('\<fs.watch\> Event \'' + event + '\' happened to file \'' + filename + '\'');
        
        if (event == "change") {
            fs.readFile(newsPath, 'utf-8', 
                function(err, data) {
                    if (err) {
                        throw err;
                    }
                    
                    try {
                        news = JSON.parse(data);
                        logger.log('File \'' + newsPath + '\' was reloaded.');
                    }
                    catch (ex) {
                        logger.log('Error parsing file \'' + newsPath + '\'');
                        logger.log('JSON.parse threw exception: ' + ex);
                    }
                }
            );
        }
    }
);

app.set('port', (process.env.PORT || 8080));
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));

if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

app.get('/', function(req, res) {
    res.render('home', {news: news});
});

app.get('/donate', function(req, res) {
    res.render('donate');
});

app.get('/contact', function(req, res) {
    res.render('contact');
});

app.get('/rules', function(req, res) {
    res.render('rules', {rules: rules});
});

app.get('/plugins', function(req, res) {
    res.render('plugins', {plugins: plugins});
});

app.listen(app.get('port'), function() {
    logger.log("Node app is running at localhost:" + app.get('port'));
});