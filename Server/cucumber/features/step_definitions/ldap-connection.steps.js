'use strict'
var assert=require('chai').assert;
var logger = require('../../../utils/logger.js');

module.exports=function()
{
	this.World = require('../support/world.js').World;
	logger.debug("logger nek");
	this.Given(/^I have an LDAP credentials$/,function(callback)
	{
		callback.pending();
		assert(true,"Not implement");
	});
	this.Given(/^I have an empty leavetype list$/,function(callback){
		callback.pending();
	});
	this.When(/^I connect to ldap$/,function(callback){
		var self=this;
		var ldapConnectTest={username:'anh.dinh@smartdev.vn',password:'abc123'};
			self.request
				.post('/api/auth')
				.use(self.prefix)
				.send(ldapConnectTest)
				.end(function(err,res){
					assert(! res.body.message ,'credentials must be correct');
					callback();
				});
		 
	});
	this.Then(/^The employee will implement to an employee system$/,function(callback){
		callback.pending();
		assert(true,'Not implement');
	})
	
}
