'user strict';
var assert = require('chai').assert;

var employeeModel = require('../../../../models/EmployeeModel.js');

module.exports = function(){

	this.Word = require('../../support/world.js').World;
	
	this.Given(/^an administrator and 12 employees in employee list$/, function(callback){
		employeeModel.remove({},function(err){
			assert(err == undefined, 'Can not remove Employee collection.');
			for(var i=0; i<=11;i++){
				var EM = new employeeModel();
				EM.employeeId = i;
				EM.firstName = 'david';
				EM.lastName= 'degea';
				EM.location =1;
				EM.isArchive= 1;
				EM.save(function(err){	
				//------nothing--------//		
				});
			};
			callback();	
		});		
	});
	//----------end Given--------//
	this.When(/^I get employee list$/, function(callback){
		var self= this;
    self.request
      .get('/api/employee')
      .use(self.prefix)
      .end(function(err, res){
        assert.isArray(res.body, 'the output should  be array');
        callback();
      });
	});
	//-----------end When----------//
	this.Then(/^the employee list have exactly 12 item$/, function(callback){
		var self= this;
    self.request
      .get('/api/employee')
      .use(self.prefix)
      .end(function(err, res){
        assert.isArray(res.body, 'the output should  be array');
        assert.lengthOf(JSON.parse(res.text), 12,'array has length of 12');
        callback();
      });
	});
	//---------end Then------------//
};