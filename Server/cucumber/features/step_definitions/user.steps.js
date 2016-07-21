'use strict';
var assert = require('chai').assert;
var logger = require('../../../utils/logger.js');
var userModel = require('../../../models/UserModel.js');

module.exports = function() {

  var listItem;

  this.World = require('../support/world.js').World;
//scenario create user
  this.Given(/^I have opened the backend server and logged-in$/, function(callback) {
    callback.pending();
  });

  this.Given(/^a Administrator$/, function(callback) {
    var self = this;
    userModel.remove({}, function(err) {
      assert(err == undefined, 'Can not remove Users collection.');
      self.request
        .get('/api/user')
        .use(self.prefix)
        .end(function(err, res) {
          
          assert.isArray(res.body, 'the output should be array');
          assert.lengthOf(JSON.parse(res.text), 0, 'array has length of 0');
          callback();
        });
    });
  });

  this.When(/^I create a new user$/, function(callback) {
    callback.pending();
  });

  this.Then(/^the user with login "tuan" and with password "123456" is created$/, function(callback) {
    assert(true, 'not implemented yet');
    callback.pending();
  });
  //scenario delete user
  this.Given(/^an Administrator$/,function(callback){
		var self = this;
		assert(true,'not implement yet');
		callback.pending();
	});
	this.When(/^I select multiple user from a list$/, function(callback){
		userModel.find({}, function(err, user){
			logger.debug (user);
			assert(true,'not implement yet');
			callback();
		})
		
	});
	this.When(/^I delete the users$/, function(callback){
		var self=this;
		self.request
			.del('/api/user/55dc0f6cdb251fc01836a92c')
			.use(self.prefix)
			.end(function( err,res){
					assert.equal(res.body.message,'Successfully deleted');
					callback();
			});
	});
	this.Then(/^the users are not displayed anymore from the list$/, function(callback){
		userModel.find({}, function(err, users){
			logger.debug(users);
			assert(true,'not implement yet');
			callback();
		})
		
	})
	//scenario disable user
	this.Given(/^an employee$/, function(callback) {
		assert(true,'not implement not');
		callback.pending();
	});

	this.Given(/^my account is not enabled$/, function(callback){
		assert(true,'not implement not');
		callback.pending();
	});

	this.When(/^I log into the application with my credentials$/, function(callback){		
		var self = this;
		self.request
			.get('/api/user/disable/username/tuan')
			.use(self.prefix)
			// .query({username:'hoangnguyen'})
			.end(function(err,res) {
				assert(!err,'The username is disable');
				callback();
			});
	});

	this.Then(/^the system  throws and exception od type DisabledUserException$/, function(callback){
		userModel.find({},function(err,user){
			logger.debug(user);
		})
		assert(true,'not implement not');
		callback.pending();
	})
};
