import express from 'express';
import bodyParser from 'body-parser';
import connection from './Server/utils/connect';
import cookieParser from 'cookie-parser';
import Authorization from './Server/controllers/auth/AuthorizationController';
import swaggerLoader from 'swagger-noodle';
import logger from './Server/utils/logger';

var passport = require('passport');
const app = express();
var port = process.env.PORT || 3007
var http = require('http').Server(app);


app.use(express.static(__dirname));
// allow cross-origin requests

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Cookie");
    res.header("Access-Control-Allow-Origin", "*    ");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header('Access-Control-Allow-Credentials',	true);
    next();
});

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));

app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(cookieParser());
// The database instance is created when this file is required
connection();
// All the route will be prefix by /api;
app.use('/api/auth',require('./Server/controllers/auth/AuthController.js'));
app.use('/api/user', require('./Server/controllers/UserController.js'));
app.use('/api/role',require('./Server/controllers/RoleController.js'));
app.use('/api/employee',require('./Server/controllers/EmployeeController.js'));
app.use('/api/leave/leaveList', require('./Server/controllers/leave/LeaveListController.js'));
app.use('/api/leave/schedulerLeave',require('./Server/controllers/leave/AssignLeaveController.js'));
app.use('/api/leave/configure/leaveType', require("./Server/controllers/leave/configure/LeaveTypeController.js"));
app.use('/api/leave/configure/workWeek', require("./Server/controllers/leave/configure/WorkWeekController.js"));
app.use('/api/leave/configure/leaveperiod',require('./Server/controllers/leave/configure/LeavePeriodController.js'));
app.use('/api/mail', require('./Server/controllers/SendMailController.js'));
app.use('/api/recoveryPass',require('./Server/controllers/RecoveryPasswordController.js'))
/** all the route of leave **/
app.use('/api/leave/leaveEntitlement',require('./Server/controllers/leave/LeaveEntitlementController.js'));
/** all the route of leave **/

// Load swagger api-docs and docs page
if (process.env.APIDOCS_ENABLED) {
  app.use(swaggerLoader({
    API_SPEC_FILE: __dirname + '/Server/api-spec/swagger.json',
    MOCK_MODE: true
  }));
}

http.listen(3007, function(){
    logger.debug('Listening on *:3007');
});
console.log('Magic happens on port ' + port);

