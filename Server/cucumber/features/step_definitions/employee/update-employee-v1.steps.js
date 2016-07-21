'user strict';
var assert = require('chai').assert;

var employeeModel = require('../../../../models/EmployeeModel.js');

module.exports = function(){

	this.World = require('../../support/world.js').World;
	//--------start scenario--------//
	this.Given(/^I have an employee$/, function (callback) {
		var Em = new employeeModel();
		Em.employeeId = '100';
		Em.firstName = 'wayner';
		Em.lastName = 'rooney';
		Em.location = '1';
		Em.save(function(err){
			// ---nothing here--//
		});
		callback();		
	});
	//---------end Given---------//
	this.When(/^I edit a employee with employeeId "([^"]*)" first name "([^"]*)" and lastname "([^"]*)"$/, function (id, fname, lname,callback){
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
				assert(err == undefined, 'can not update Employees');
				callback();
			});		
	});
	//-------------end When-------/
	this.Then(/^The employee have employeeId 100 has updated$/, function (callback) {
		employeeModel.findOne({employeeId: '100'}, function(err, employee){
			assert.equal(employee.firstName, 'david', 'firstName is corrected');
			assert.equal(employee.lastName, 'beckham', 'lastName is corrected');
			callback();
		});	
	});
	//------------end Then--------//
};