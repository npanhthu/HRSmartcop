import mongoose from 'mongoose';
import logger from './logger.js';

// var connectionUrl = 'mongodb://localhost/smartcorp';
// this is my mongodb live on site modulusmongo use instead no need install mongo on your localhost
var connectionUrl = 'mongodb://anhthu:123456@apollo.modulusmongo.net:27017/Epiti6qe';

function connection() {
	mongoose.connect(connectionUrl, function(err) {
		var db = mongoose.connection;
		db.on('error',function (err) {  
            console.log('Mongoose connection error: ' + err);
        });
		db.once('open', function (callback) {
  			console.log("Mongoose: successfully connected!");
		});
	});
};

export default connection
