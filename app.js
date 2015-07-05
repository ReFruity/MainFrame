var express = require('express');
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

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});

