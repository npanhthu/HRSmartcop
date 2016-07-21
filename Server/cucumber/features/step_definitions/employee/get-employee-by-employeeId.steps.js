'user strict';
var assert = require('chai').assert;

var employeeModel = require('../../../../models/EmployeeModel.js');

module.exports= function(){
	var listItem;
  	this.World = require('../../support/world.js').World;



this.Given(/^an list employee and (\d+) employees in the employee list$/, function (arg1, callback) {
  employeeModel.remove({},function(err){
			assert(err == undefined, 'Can not remove employee collection.');
			for(var i=1; i<=arg1;i++){
				var EM = new employeeModel();
				EM.employeeId = 'SMC000'+i;
				EM.firstName = 'david'+i;
				EM.lastName= 'degea';
				EM.location =1;
				EM.isArchive= 1;
				EM.save(function(err){	
					assert(err == undefined, 'Can not add employee collection.');
				});
			};
			callback();	
		});		
});

this.When(/^i get employee by employeeId "([^"]*)"$/, function (arg1, callback){
  var self = this;
  	self.request
    .get('/api/employee/'+arg1)
    .use(self.prefix)
    .end(function(err, res){
      assert(err == undefined, 'Can not get employee.');
      callback();
    });
});

this.Then(/^return employee object of employee have employeeId "([^"]*)"$/, function (arg1, callback) {
  var self = this;
  	self.request
    .get('/api/employee/'+arg1)
    .use(self.prefix)
    .end(function(err, res){
    	assert.equal(res.body.employeeId, 'SMC0002', 'get is incorect!');
    	assert.equal(res.body.firstName, 'david2', 'get is incorect!');
      callback();
    });
});

};