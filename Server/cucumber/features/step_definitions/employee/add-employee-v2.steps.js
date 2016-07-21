'user strict';
var assert = require('chai').assert;

var employeeModel = require('../../../../models/EmployeeModel.js');

module.exports= function(){
	var listItem;
  	this.World = require('../../support/world.js').World;

	this.Given(/^I have an employee list have "([^"]*)" item$/, function (arg1, callback) {
	  employeeModel.remove({},function(err){
			assert(err == undefined, 'Can not remove Employees collection.');
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

	this.When(/^I add employee with the employee name "([^"]*)" and with the last name "([^"]*)"$/, function (arg1, arg2, callback) {
	  var self = this;
    var body = {employeeId: '001', firstName: arg1, lastName: arg2, location: '1'};    
    self.request
      .post('/api/employee')
      .use(self.prefix)
      .set('Content-Type', 'application/json')
      .send(body)
      .end(function(err, res){
      	assert(err == undefined, 'can not add Employees');
        assert.isString(res.body.message, 'the output should  be array');
        callback();
      });
	});

	this.Then(/^the employee list have exactly "([^"]*)" item$/, function (arg1, callback) {
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