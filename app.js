var express = require('express');
var app = express();

// app.set('view engine', 'jade');
app.set('port', (process.env.PORT || 8080));
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
    // res.render('home', {
    //   title: 'Welcome'
    // });
    res.render('index.html');
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});

