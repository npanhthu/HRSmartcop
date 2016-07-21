'user strict';
var assert = require('chai').assert;

var employeeModel = require('../../../../models/EmployeeModel.js');

module.exports = function(){
	this.World = require('../../support/world.js').World;

	this.Given(/^an administrator and have (\d+) employee in the employee list$/, function (arg1, callback) {
	  employeeModel.remove({},function(err){
			assert(err == undefined, 'Can not remove Employee collection.');
			for(var i=0; i<arg1;i++){
				var EM = new employeeModel();
				EM.employeeId = i;
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

	this.When(/^i delete an employee have employeeId "([^"]*)"$/, function (arg1, callback) {
	  var self = this;
		self.request
			.get('/api/employee/notArchive/'+arg1)
			.use(self.prefix)
			.set('Content-Type','application/json')
			.end(function(err,res){
				assert(err == undefined, 'can not delete Employees');
				assert.equal(res.body.message, 'OK','delete fail');
				callback();
			});
	});

	this.Then(/^the employee list have "([^"]*)" items$/, function (arg1, callback){
	  var self = this;
    self.request
      .get('/api/employee')
      .use(self.prefix)
      .end(function(err, res){ 	
        assert.isArray(res.body, 'the output should  be array');
        assert.lengthOf(JSON.parse(res.text), arg1,'array has length of '+arg1);
        callback();
      });
	});

};