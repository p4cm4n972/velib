var express = require('express');
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname,'public')))

app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//DB CONNECTION
var db = require('./db.js');

app.get('/', function(req, res, next) {
    var collection = db.get().collection('paris');
    collection.find().toArray(function (err,data) {
        console.log(data[0]);
    res.render('index');
    })
});

app.get('/liste', function(req, res, next) {
    var collection = db.get().collection('paris');
    collection.find().toArray(function (err,data) {
        console.log(data[0]);
    res.render('liste',{file: data, title: 'Velib', nom: data[0].name, adresse: data[0].address});
    })
});
app.get('/map', function(req, res, next) {
    var collection = db.get().collection('paris');
    collection.find().toArray(function (err,data) {
        var velibStrArray = '';
        if (data.length > 0) {
            velibStrArray = JSON.stringify(data);
        }
    res.render('map',{req: req, velibStrArray: velibStrArray, title: 'Map Velib'});
    })
})
// 404 RESPONSE
app.use(function(req, res, next){
    res.status(404).render('http-404-pug', {
        documentTitle: 'Document non trouvé (ERREUR 404)'
    });
});
//SET UP MONGODB CONNCECTION
var dbConfig = {
    dbName: 'velib',
    dbHost:'localhost'
}
db.connect(dbConfig, function(err) {
    if(err) {
        console.log('Unable to connect to database""'+ dbConfig.dbName + '" on"' + dbConfig.dbHost + '"');
        process.exit(1);
    } else {
        console.log('Connected to database"' + dbConfig.dbName + '"on"' + dbConfig.dbHost + '"');

        var server = app.listen(3333, function() {
            var serverHost = server.address().address;
            var serverPort = server.address().port;
            console.log(('listen to') + (serverHost) + ('on port') + (serverPort));
        });
    }
});