'user strict';
var assert = require('chai').assert;

var employeeModel = require('../../../../models/EmployeeModel.js');

module.exports = function(){
	this.World = require('../../support/world.js').World;

  //------------------------------------------------------------------------------------------------------//
  this.Given(/^I have an empty employee list$/, function(callback){
  	var self = this;
  	employeeModel.remove({}, function(err){
      assert(err == undefined, 'can not remove Employees');
  		self.request
  			.get('/api/employee')
  			.use(self.prefix)
  			.end(function(err, res){
          assert(err == undefined, 'can not get Employees');
  				assert.isArray(res.body, 'the output should  be array');
  				assert.lengthOf(JSON.parse(res.text), 0,'array has length of 0');
  				callback();
  			});
  	});
  });
  //-----------end Given-------//
  this.When(/^I add employee with the name "([^"]*)" and with the last name "([^"]*)"$/,function(fname, lname, callback){
    var self = this;
    var body = {employeeId: '001', firstName: fname, lastName: lname, location: '1'};    
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
  //----------end When----------//
  this.Then(/^the employee list have exactly 1 item$/, function(callback){
    var self= this;
    self.request
      .get('/api/employee')
      .use(self.prefix)
      .end(function(err, res){        
        assert.isArray(res.body, 'the output should  be array');
        assert.lengthOf(JSON.parse(res.text), 1,'array has length of 1');
        callback();
      });
  });
};