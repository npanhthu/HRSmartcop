var assert = require('chai').assert;
var entitleModel = require('../../../models/LeaveEntitlementModel');
var logger = require('../../../utils/logger.js');
var employeeModel = require('../../../models/EmployeeModel')
module.exports = function(){
    this.World = require('../support/world.js').World;
    this.Given(/^a SCP Administrator$/,function(callback){
       callback.pending();
    })
    this.When(/^I create a new entitlement$/,function(callback){
        var self = this
        var entitle = {}
        entitle.employeeId = 'SMC0002';
        entitle.leaveTypeId='55c456eb5a24bd292a911861';
        entitle.leaveTypeName='Summer holiday';
        entitle.leaveTypeColor = '#008000';
        entitle.entitlementDay='6';
        entitle.leavePeriodId='55c310d3dcc2783a2ca2d039';
        entitleModel.remove({},function(err){
            if(err)console.log('can not remove entitlement')
            self.request
                .post('/api/leave/leaveEntitlement')
                .use(self.prefix)
                .send(entitle)
                .end(function(err,res){
                    if(err) {
                        logger.error('can not add new entitlement');
                    }
                    assert.equal(res.body.message,'LeaveEntitlement added success')
                    callback();
                })
        })
    })
    this.Then(/^the entitlement is created$/,function(callback){
        var self = this
        self.request
            .get('/api/leave/leaveEntitlement/findLeaveEntitleByEmployeeId/SMC0002')
            .use(self.prefix)
            .end(function(err,res){
                if(err)
                {
                   logger.error('can not get any entitlement') 
                }
                    
                assert.isArray(res.body)
                callback();
            })
    })

    logger.debug('-------------------------------------------------------------------------------')
    this.Given(/^a SCP Administrator$/,function(callback){
        callback.pending();
    })
    this.When(/^I edit a entitlement$/,function(callback){
        var self = this
        var entitle = {}
        entitle.employeeId = 'SMC0002';
        entitle.leaveTypeId='55c456eb5a24bd292a911861';
        entitle.leaveTypeName='Summer holiday';
        entitle.leaveTypeColor = '#008000';
        entitle.entitlementDay='89';
        entitle.leavePeriodId='55c310d3dcc2783a2ca2d039';
        self.request
            .post('/api/leave/leaveEntitlement')
            .use(self.prefix)
            .send(entitle)
            .end(function(err,res){
                if(err)
                    {
                        logger.error('can not edit new entitlement')
                    }
                assert.equal(res.body.message,'LeaveEntitlement was updated!')
                callback();
            })
    })
    this.Then(/^the entitlement is changed$/,function(callback){
        var self = this
        self.request
            .get('/api/leave/leaveEntitlement/findLeaveEntitleByEmployeeId/SMC0002')
            .use(self.prefix)
            .end(function(err,res){
                if(err)
                {
                    logger.error('can not get any entitlement')
                }          
                assert.equal(res.body[0].entitlementDay,89)
                callback();
            })
    })
    logger.debug('------------------------------------------------------------------');

    this.Given(/^a SCP Administrator$/,function(callback){
        callback.pending()
    })
    this.When(/^I search an entitlement$/,function(callback){
        var self = this
        employeeModel.find({'employeeId':'SMC0002'},function(err,result){
            if(err)console.log('can not find entitle with employeeid SMC0002')
            self.request
                .get('/api/leave/leaveEntitlement/findByEmployeeID/'+result[0]._id)
                .use(self.prefix)
                .end(function(err,res){
                    if(err)
                    {
                        logger.error('can not found');
                    }
                    assert.isArray(res.body)
                    callback();
                })
        })
    })
    this.Then(/^the following entitlement are listed$/,function(table,callback){
        table.hashes();
        callback.pending();
    })

    logger.debug('------------------------------------------------------------------')

    this.Given(/^a SCP Administrator$/,function(callback){
        callback.pending();
    })
    this.When(/^I select multiple entitlements from a list$/,function(callback){
        callback.pending();
    })
    this.When(/^I delete the entitlements$/,function(callback){
        var self = this
        entitleModel.find({'employee.employee_id':'SMC0002'},function(err,result){
            if(err)console.log('can not get any entitle')
                self.request
                    .del('/api/leave/leaveEntitlement/'+result[0]._id)
                    .use(self.prefix)
                    .end(function(err,res){
                        if(err)
                        {
                            logger.error('can not delete entitlement');
                        }
                        assert.equal(res.body.message,'Entitle deleted successful')
                        callback()
                    })

        })
    })
    this.Then(/^the entitlements are not displayed anymore from the list$/,function(callback){
        var self = this
        self.request
            .get('/api/leave/leaveEntitlement/findLeaveEntitleByEmployeeId/SMC0002')
            .use(self.prefix)
            .end(function(err,res){
                if(err)
                    {
                        logger.error('can not get any entitlement')
                    }
                assert.isArray(res.body)
                assert.lengthOf(JSON.parse(res.text), 0, 'array has length of 0');
                callback()
            })
})


}