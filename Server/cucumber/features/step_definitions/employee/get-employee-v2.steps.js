'user strict';
var assert = require('chai').assert;

var employeeModel = require('../../../../models/EmployeeModel.js');

module.exports = function(){

	this.Word = require('../../support/world.js').World;
	
	this.Given(/^an administrator and empty employees in employee list$/, function (callback) {
	  employeeModel.remove({},function(err){
			assert(err == undefined, 'Can not remove Employee collection.');
			callback();	
		});		
	});

	this.When(/^I get all employee from employee list$/, function (callback) {
	  var self= this;
    self.request
      .get('/api/employee')
      .use(self.prefix)
      .end(function(err, res){
        assert(err == undefined, 'can not get Employees');
        assert.isArray(res.body, 'the output should  be array');
        callback();
      });
	});

	this.Then(/^the employee list exactly (\d+) item$/, function (arg1, callback) {
	  var self= this;
    self.request
      .get('/api/employee')
      .use(self.prefix)
      .end(function(err, res){
        assert.isArray(res.body, 'the output should  be array');
        assert.lengthOf(JSON.parse(res.text),arg1,'array has length of '+arg1);
        callback();
      });
	});

};