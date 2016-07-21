'user strict';
var assert = require('chai').assert;

var employeeModel = require('../../../../models/EmployeeModel.js');

module.exports = function(){

	this.World = require('../../support/world.js').World;

	this.Given(/^an employee and administrator$/, function (callback) {
	   var Em = new employeeModel();
		Em.employeeId = '102';
		Em.firstName = 'wayner';
		Em.lastName = 'rooney';
		Em.location = '1';
		Em.save(function(err){
			// ---nothing here--//
		});
		callback();
	});

	this.When(/^I edit an employee have employeeId "([^"]*)" firstName "([^"]*)" and lastName "([^"]*)"$/, function (id, fname, lname, callback) {
	  var self = this;
		var body = {
			employeeId:id,
			firstName: fname,
			lastName: lname,			
		};
		self.request
			.put('/api/employee')
			.use(self.prefix)
			.set('Content-Type', 'application/json')
			.send(body)
			.end(function(err, res){			
				assert.isString(res.body.message,'message must is string!');
				assert.equal(res.body.message,'Employees validation failed', 'validate employee!');
				callback();
			});		
	});

	this.Then(/^The employee update fail$/, function (callback) {
	  employeeModel.findOne({employeeId: '102'}, function(err, employee){
			assert.equal(employee.firstName, 'wayner', 'firstName is incorrected');
			assert.equal(employee.lastName, 'rooney', 'lastName is incorrected');
			callback();
		});	
	});

};