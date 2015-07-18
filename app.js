var express = require('express');
var fs = require('fs');
var app = express();

app.set('port', (process.env.PORT || 8080));
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));

if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/donate', function(req, res) {
    res.render('donate');
});

app.get('/contact', function(req, res) {
    res.render('contact');
});

app.get('/rules', function(req, res) {
    res.render('rules');
});

app.get('/plugins', function(req, res) {
    var json = JSON.parse(fs.readFileSync('public/json/plugins.json'));
    res.render('plugins', {plugins: json});
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});