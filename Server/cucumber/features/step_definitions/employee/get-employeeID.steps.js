'user strict';
var assert = require('chai').assert;

var employeeModel = require('../../../../models/EmployeeModel.js');

module.exports= function(){
	var listItem;
  this.World = require('../../support/world.js').World;

	this.Given(/^an employee list and have (\d+) employee$/, function (arg1, callback) {
	  employeeModel.remove({},function(err){
			assert(err == undefined, 'Can not remove Employee collection.');
			for(var i=1; i<=arg1;i++){
				var EM = new employeeModel();
				EM.employeeId = 'SMC000'+i;
				EM.firstName = 'david';
				EM.lastName= 'degea';
				EM.location =1;
				EM.isArchive= 1;
				EM.save(function(err){	
				});
			};
			callback();	
		});		
	});

	this.When(/^I get new EmployeeId to add new employee$/, function (callback) {
	  var self = this;
  	self.request
	    .get('/api/employee/autoGenerateEmployeeId')
	    .use(self.prefix)
	    .end(function(err, res){
	      assert(err == undefined, 'Can not get new EmployeeId.');
	      callback();
	    });
	});

	this.Then(/^return employeeId are "([^"]*)"$/, function (arg1, callback) {
	  var self = this;
    self.request
      .get('/api/employee/autoGenerateEmployeeId')
      .use(self.prefix)
      .end(function(err, res){
        assert(res.body.objectId == arg1, 'objectId not equal!');
        callback();
      });
	});

};