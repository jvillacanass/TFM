var Client = require('node-rest-client').Client;
var client = new Client();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://jvillacanass:rr77YxYYnFDjnaOt@cluster0-shard-00-00-akgo9.mongodb.net:27017,cluster0-shard-00-01-akgo9.mongodb.net:27017,cluster0-shard-00-02-akgo9.mongodb.net:27017/citybikes?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"

var cron = require('node-cron');

cron.schedule('*/5 * * * *', function(){
var estaciones;
MongoClient.connect(url, function(err, db) {
	
  if (err) throw err;	
	client.get("http://api.citybik.es/v2/networks/bicimad?fields=stations", function (data, response) {		
		estaciones = null;
		for (var id in data) {				
			estaciones = JSON.stringify(data[id]["stations"]);					
		}		
		estaciones = JSON.parse(estaciones);
		db.collection("stations").insertMany(estaciones, function(err, res) {
			if (err) throw err;
			require('console-stamp')(console, '[ddd mmm dd yyyy HH:MM:ss]');
			console.log("Filas insertadas: " + res.insertedCount);			
			db.close();
		});			
	});
});
});