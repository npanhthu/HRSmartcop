'use strict';
var assert = require('chai').assert;
var logger = require('../../../utils/logger.js');
var userModel = require('../../../models/UserModel.js');

module.exports = function() {
	this.World = require('../support/world.js').World;
	this.Given(/^a Administrator$/,function(callback){
		assert(true,'not implement yet');
		callback.pending();
	});
	this.Given(/^these following users are created by Administrator$/, function(data,callback){
		data.hashes();
		assert(true,'not implement yet');
		callback();
	});
	this.When(/^I list all users$/, function(callback){
		var self = this;
		self.request
			.get('/api/user')
			.use(self.prefix)
			// .query({username: "employee1", password:"MyPassord2015"}, {username:"employee2", password:"MyPassord2015"})
			.end(function(err,res){
				var _list = res.body;
				logger.debug("list users:", _list);
		assert(!err, 'This is a list users');
		callback();
			});
		
	});
	this.Then(/^the following users are listed$/, function(doc,callback){
		doc.hashes();
		callback.pending();
	})
}