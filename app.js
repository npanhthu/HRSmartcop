require('6to5/register');

// run commandline [NODE_ENV=production node app.js] for production release
// or uncomment the below line
process.env.NODE_ENV = 'production';

// using APIDOCS for rendering Swagger API
process.env.APIDOCS_ENABLED = true;

// do you want to by pass authentication?
process.env.AUTH_BYPASS = true;

var server = require('./server.js');
