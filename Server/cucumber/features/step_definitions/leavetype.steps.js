'use strict';
var logger = require('../../../utils/logger.js');
var assert=require('chai').assert;
var leaveTypeModel = require('../../../models/LeaveTypeModel.js');

module.exports=function()
{
	this.World = require('../support/world.js').World;

	this.Given(/^I have opened the backend server and logged-in$/,function(callback)
	{
		callback.pending();
	});
	this.Given(/^I have an empty leavetype list$/,function(callback){
		callback.pending();
	});
	this.When(/^I add an leavetype to the list$/,function(callback){
		var self=this;
		var leaveTypeTest={leavetype:'Tet Vn',country:'Viet Nam',_color:'green'};
		 leaveTypeModel.remove({},function(err){
		 	if(err) {
		 		logger.debug('can not remove leave type');
		 	}
			self.request
				.post('/api/leave/configure/leaveType')
				.use(self.prefix)
				.send(leaveTypeTest)
				.end(function(err,res){
					assert.equal(res.body.message,"LeaveType added success","add leavetype successful")
					callback();
				});
		 })
	});
	this.Then(/^The leavetype list contains a single item$/,function(callback){
		callback.pending();
	})
	// scenario get leavetype 
	this.Given(/^an Administrator$/,function(callback){
		callback.pending();
	});

	this.Given(/^these following leavetype are created by Administrator$/,function(table,callback){
		table.hashes();
		callback();
	});

	 this.When(/^I list all leavetypes$/,function(callback){
	 	var self=this;
		 	self.request
	            .get('/api/leave/configure/leaveType')
	            .use(self.prefix)
	            .end(function(err,res){
	            	console.log(res.body)
	                assert.isArray(res.body,'it must be an Array')
	                callback();
	            })
	 });

	 this.Then(/^the following leavetype are listed$/,function(table,callback){
	 	table.hashes();
	 	callback();
	 });

	 //scenario delete leavetype
	 this.Given(/^an Administrator$/,function(callback){
		callback.pending();
	});
     this.When(/^I select multiple leavetype from a list$/,function(callback){
        callback.pending();
    })
     this.When(/^I delete the leavetypes$/,function(callback){
        var self = this
        leaveTypeModel.find({},function(err,result){
            if(err) {
            	logger.error('can not find any leavetypes');
            }
            if(result){
                logger.debug('this is length'+result.length)
               for(var i=0;i<result.length;i++){
                   self.request
                       .del('/api/leave/configure/leaveType/'+result[i]._id)
                       .use(self.prefix)
                       .end(function(err,res){
                           assert.equal(res.body.message,'LeaveType Successfully deleted','role must be deleted successful')
                       })
               }
                callback()
            }
        })
    })
    this.Then(/^the leavetypes are not displayed anymore from the list$/,function(callback){
        var self = this
        self.request
            .get('/api/leave/configure/leaveType')
            .use(self.prefix)
            .end(function(err,res){
                assert.isArray(res.body, 'the output should be array');
                assert.lengthOf(JSON.parse(res.text), 0, 'array has length of 0');
                callback()
            })
    })

}
