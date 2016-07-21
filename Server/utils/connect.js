import mongoose from 'mongoose';
import logger from './logger.js';

var connectionUrl = 'mongodb://localhost/smartcorp';

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
