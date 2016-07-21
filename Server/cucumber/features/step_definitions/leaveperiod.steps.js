'use strict';
var logger = require('../../../utils/logger.js');
var assert=require('chai').assert;
var leavePeriodModel = require('../../../models/LeavePeriodModel.js');

module.exports=function()
{
	this.World = require('../support/world.js').World;

	this.Given(/^I have opened the backend server and logged-in$/,function(callback)
	{
		callback.pending();
	});
	this.Given(/^I have an empty leaveperiod list$/,function(callback){
		callback.pending();
	});
	this.When(/^I add an leaveperiod to the list$/,function(callback){
		var self=this;
		var leavePeriodTest={month:'12',day:'24',start:'26/12/2015',end:'27/12/2015'};
		 leavePeriodModel.remove({},function(err){
		 	if(err) {
		 		logger.error('can not remove leave period');
		 	}
		 		leavePeriodModel.remove({},function(err){
			self.request
				.post('/api/leave/configure/leaveperiod')
				.use(self.prefix)
				.send(leavePeriodTest)
				.end(function(err,res){
					assert.notEqual(res.body.message,"Save period success!","leaveperiod must be invalid");
					callback();
				});
			})
		 })
	});
	this.Then(/^The leaveperiod list contains a single item$/,function(callback){
		callback.pending();
	});

}