var express = require('express'),
    app = express();

// StartApp NodeJS Server Config
var server_ip    = process.env.OPENSHIFT_NODEJS_IP || 'localhost',
    server_port  = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 3000;

// StartApp MongoDB Config
var MongoClient = require('mongodb').MongoClient,
    format = require('util').format,

    host     = process.env.OPENSHIFT_MONGODB_DB_HOST,
    username = process.env.OPENSHIFT_MONGODB_DB_USERNAME,
    password = process.env.OPENSHIFT_MONGODB_DB_PASSWORD,
    port     = process.env.OPENSHIFT_MONGODB_DB_PORT,
    db_name  = process.env.OPENSHIFT_APP_NAME,
    mongodb_uri = "mongodb://" + username + ":" + password + "@" + host + ":" + port + "/" + db_name;


app.get('/', function (req, res) {
  res.send('Hello World!')

  // Свързване с базата данни
  MongoClient.connect(mongodb_uri, function(err, db) {
    if(err) {
      return console.dir(err);
    }

    db.collection('test', function(err, collection) {});
    db.collection('test', { w:1 }, function(err, collection) {});
    db.createCollection('test', function(err, collection) {});
    db.createCollection('test', { w:1 }, function(err, collection) {});
  });

})

var server = app.listen(server_port, server_ip, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
