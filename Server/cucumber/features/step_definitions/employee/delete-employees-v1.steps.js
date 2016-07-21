'user strict';
var assert = require('chai').assert;

var employeeModel = require('../../../../models/EmployeeModel.js');

module.exports = function(){
	this.World = require('../../support/world.js').World;

	//------start scenario ----------//
	this.Given(/^an Administrator and an employee with employeeId 011$/, function(callback){
		var EM = new employeeModel();
		EM.employeeId = '011';
		EM.firstName = 'David';
		EM.lastName = 'beckham';
		EM.location = '1';
		EM.isArchive = 1;
		EM.save(function(err){
		});	
		callback();
	});
	//------end Given--------------//
	this.When(/^I delete the employee have employee 011$/, function(callback){
		var self = this;
		self.request
			.get('/api/employee/notArchive/011')
			.use(self.prefix)
			.set('Content-Type','application/json')
			.end(function(err,res){
				callback();
			});
	});
	//-------end When--------//
	this.Then(/^the employee are not displayed anymore from the list$/,function(callback){
		employeeModel.findOne({employeeId: '011'},function(err, employee){
			assert.equal(employee.isArchive, 0, 'the employee had delete');
			callback();
		});				
	});
	//--------end Then ------//
};