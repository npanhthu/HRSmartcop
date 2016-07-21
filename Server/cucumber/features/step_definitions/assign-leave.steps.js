var logger = require('../../../utils/logger.js');
var assert = require('chai').assert;
var assignModel = require('../../../models/AssignLeaveModel');
module.exports = function(){
    this.World = require('../support/world.js').World;
    this.Given(/^a user$/,function(callback){
        callback.pending()
    })
    this.When(/^I want to click on a button "add leave" above the calendar$/,function(callback){
        callback.pending()
    })
    this.Then(/^I fill the information of my leave and display it on the calendar$/,function(callback){
        var self = this
        var assign = {}
        assign._employeeId = 'SMC0002';
        assign._leaveTypeId = '55dd17f2f3c59d580cebf6a7';
        assign._fromDate = '08/29/2015';
        assign._toDate = '08/31/2015';
        assign._fromTime = 'FullDay';
        assign._toTime = 'FullDay';
        assign._comment = '';
        assign._color = '#008000';
        assign._user = 'employee2';
        assign._leaveType = 'Tet Vn';
        assign._status = 1;
        assignModel.remove({},function(err){
            if(err)logger.debug('can not remove assign')
            self.request
                .post('/api/leave/schedulerLeave')
                .use(self.prefix)
                .send(assign)
                .end(function(err,res){
                    if(err)logger.debug('can not create new assign')
                    assert.equal(res.body.msg,'Success')
                    callback()
                })
        })
    })

    logger.debug('--------------------------------------------------------------------')

    this.Given(/^a supervisor$/,function(callback){
        callback.pending()
    })
    this.When(/^I open the leave calendar$/,function(callback){
        callback.pending()
    })
    this.Then(/^I want to view all the leave from employee$/,function(callback){
        var self = this
        self.request
            .get('/api/leave/schedulerLeave')
            .use(self.prefix)
            .end(function(err,res){
                if(err)logger.debug('can not get any assign')
                assert.isArray(res.body)
                callback()
            })
    })

    logger.debug('----------------------------------------------------------------------')
    this.Given(/^a supervisor, user$/,function(callback){
        callback.pending()
    })
    this.When(/^I open the leave calendar$/,function(callback){
        callback.pending()
    })
    this.When(/^I right click on a leave$/,function(callback){
        callback.pending()
    })
    this.Then(/^I have a contextual menu displayed and I can edit my leave$/,function(callback){
        var self = this
        var assign = {}
        assign._employeeId = 'SMC0002';
        assign._leaveTypeId = '55c456fa5a24bd292a911862';
        assign._fromDate = '09/01/2015';
        assign._fromTime = 'FullDay';
        assign._toDate = '09/09/2015';
        assign._toTime = 'FullDay';
        assign._comment = '';
        assign._user = 'employee2';
        assign._leaveType = 'Winter holiday';
        self.request
            .put('/api/leave/schedulerLeave')
            .use(self.prefix)
            .send(assign)
            .end(function(err,res){
                if(err)logger.debug('can not edit assisgn')
                assert.equal(res.body.msg,'Update successful')
                callback()
            })

    })
    this.Then(/^I can delete my leave$/,function(callback){
        var self = this
        assignModel.find({},function(err,result){
            if(err)logger.debug('can not find any assign')
            self.request
                .del('/api/leave/schedulerLeave/'+result[0]._id)
                .use(self.prefix)
                .end(function(err,res){
                    if(err)logger.debug('can not delete assisgn')
                    assert.equal(res.body.msg,'Delete successful')
                    callback()
                })
        })

    })
}