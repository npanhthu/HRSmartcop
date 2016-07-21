'use strict';
var assert = require('chai').assert;
var logger = require('../../../utils/logger.js');

var roleModel = require('../../../models/RoleModel');
module.exports = function(){
    this.World = require('../support/world.js').World;
    this.Given(/^an Administrator$/,function(callback){
        assert(true,'not implement yet')
        callback();
    });
    this.When(/^I create a new role$/,function(callback){
        var self = this;
        var role ={}
        role.userRole = 'Admintrator';
        role.userRoleType = 0;
        role.nameRoleType= "Administrator";
        role.Permission = [{"permissionId":"0","label":"User","rights":[{"name":"read","right_id":"1"},{"name":"write","right_id":"2"}]},
            {"permissionId":"8","label":"Write Employee","rights":[{"name":"write","right_id":"2"}]}]
        roleModel.remove({},function(err){
            if(err)logger.error('can not remove roles')
            self.request
                .post('/api/role')
                .use(self.prefix)
                .send(role)
                .end(function(err,res){
                    assert.equal(res.body.success,'userRole created!','Role must be created')
                    callback();
                })
        })
    });
    this.Then(/^the role is created$/,function(callback){
        var self = this;
        self.request
            .get('/api/role')
            .use(self.prefix)
            .end(function(err,res){
                assert.isArray(res.body,'it must be an array')
                callback();
            })

    })
    logger.debug('--------------------------------------------------------------------------------')

    this.Given(/^an Administrator$/,function(callback){
        callback.pending();
    })
    this.Given(/^these following roles are created by Administrator$/,function(table,callback){
        table.hashes();
        callback()

    })
    this.When(/^I list all roles$/,function(callback){
        var self = this;
        self.request
            .get('/api/role')
            .use(self.prefix)
            .end(function(err,res){
                assert.isArray(res.body,'it must be an array')
                callback();
            })

    })
    this.Then(/^the following users are listed$/,function(table,callback){
        table.hashes();
        callback()
    })

    logger.debug('----------------------------------------------------------------------------------')

    this.Given(/^an Administrator$/,function(callback){
        callback.pending();
    })
    this.When(/^I select multiple role from a list$/,function(callback){
        callback.pending();

    })
    this.When(/^I delete the roles$/,function(callback){
        var self = this
        roleModel.find({},function(err,result){
            if(err)logger.error('can not find any roles')
            if(result){
                logger.debug('this is length'+result.length)
               for(var i=0;i<result.length;i++){
                   self.request
                       .del('/api/role/'+result[i]._id)
                       .use(self.prefix)
                       .end(function(err,res){
                           assert.equal(res.body.message,'Role Successfully deleted','role must be deleted successful')
                       })
               }
                callback()
            }
        })
    })
    this.Then(/^the roles are not displayed anymore from the list$/,function(callback){
        var self = this
        self.request
            .get('/api/role')
            .use(self.prefix)
            .end(function(err,res){
                assert.isArray(res.body, 'the output should be array');
                assert.lengthOf(JSON.parse(res.text), 0, 'array has length of 0');
                callback()
            })
    })
}