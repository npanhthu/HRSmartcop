'use strict';
var assert = require('chai').assert;

var userModel = require('../../../models/UserModel.js');

module.exports = function() {
	this.World = require('../support/world.js').World;
	this.Given(/^a user$/, function(callback){
		assert(true, 'not implement yet');
		callback.pending();
	});
	this.When(/^I log into the application with my credential$/, function(callback){
		var self = this;
		var body ={username:'hoangnguyen',password:'123456'};
		self.request
		  .post('/api/auth')
		  .use(self.prefix)
		  .send(body)
		  .end(function(err,res){
		assert(!err, "The username or password don't match");  	
		callback();
		  });

	});
	this.Then(/^my user account is correctly authenticated$/, function(callback){
		assert(true, 'not implement yet');
		callback.pending();
	});
}
