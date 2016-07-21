import express from 'express';
import LeaveEntitlement from '../../models/LeaveEntitlementModel.js';
import Employees from '../../models/EmployeeModel.js';
import LeaveType from '../../models/LeaveTypeModel.js';
import configApi from '../../config/api.js';
import logger from '../../../Server/utils/logger.js';
const router = express.Router();
router.use(function(req, res, next) {
	logger.debug('Something is happening with leaveEntitlement controller. ');
	next();
});
 router.route('/findLeaveEntitleByEmployeeId/:employeeId')
    .get(function(req,res){
        var employeeId = req.params.employeeId;
        logger.debug("id is " + employeeId);
        LeaveEntitlement.find({'employee.employee_id' : employeeId},function(err,employee){
            if(err){
                if(configApi.checkVersion()){
                    res.send("error : " + err);
                }
                else{
                    res.status(401).json({
                        code: 10002,
                        error : err
                    })
                }
            }else{
                res.json(employee);
            }
        })
    })

//entitlement
router.route('/')
.post(function(req,res)
{
    logger.debug("to service addLeaveEntitlement");
    logger.debug(req.body.employeeId);
    var leaveEntitlement = new LeaveEntitlement();
    leaveEntitlement.employee.employee_id = req.body.employeeId;
    leaveEntitlement.leaveType.leavetype_id=req.body.leaveTypeId;
    leaveEntitlement.leaveType.name=req.body.leaveTypeName;
    leaveEntitlement.leaveType.color = req.body.leaveTypeColor;
    leaveEntitlement.entitlementDay=req.body.entitlementDay;
    leaveEntitlement.leavePeriodId=req.body.leavePeriodId;
    Employees.findOne({'employeeId':req.body.employeeId}, function (err, doc)
    {
        if(doc)
        {
            logger.debug(doc);
            leaveEntitlement.employee.name=doc.firstName + " " + doc.lastName;
        }
        else{
            if(configApi.checkVersion()){
                logger.debug('this is error')
                res.send(err)
            }
            else{
                res.status(401).json({
                    code: 10002,
                    error: err
                })
            }
        }
    });
    LeaveEntitlement.findOne({
        'employee.employee_id':req.body.employeeId
    },function(err,leaveEntitlementEdit){
        if(leaveEntitlementEdit){
            leaveEntitlementEdit.leaveType.leavetype_id=req.body.leaveTypeId;
            leaveEntitlementEdit.leaveType.name=req.body.leaveTypeName;
            leaveEntitlementEdit.entitlementDay=req.body.entitlementDay;
            leaveEntitlementEdit.leavePeriodId=req.body.leavePeriodId;
            leaveEntitlementEdit.save(function(err) {
                if (err) {
                    if(configApi.checkVersion()){
                        res.send(err);
                    }
                    else{
                        res.status(401).json({
                            code: 10002,
                            error: err
                        })
                    }
                }
               else{
                    if(configApi.checkVersion()){
                        res.json({
                            message: 'LeaveEntitlement was updated!'
                        });
                    }
                    else{
                        res.json({
                            success: 'LeaveEntitlement was updated!'
                        });
                    }
                }
            });
        }else{
            leaveEntitlement.save(function(err){
                if(err) {
                    if(configApi.checkVersion()){
                        res.send("Error");
                    }
                    else{
                        res.status(401).json({
                            code: 10002,
                            error: err
                        })
                    }
                }
                else{
                    if(configApi.checkVersion()){
                        res.json({message:"LeaveEntitlement added success"});
                    }
                    else{
                        res.json({success:"LeaveEntitlement added success"});
                    }
                }
            })
        }
    })
})
// get leave type by employee
router.route('/findLeaveTypeByEmployee/:employeeId')
.put(function(req, res)
{  
    Employees.findOne({employeeId: req.params.employeeId}, function(err, emp){
        if(err) {
            if(configApi.checkVersion()){
                res.send(err);
            }
            else{
                res.status(401).json({
                    code: 10002,
                    error: err
                })
            }
        }
        else{
            LeaveType.find({country: emp.location}, function(err, leaveType){
                if(err) {
                    if(configApi.checkVersion()){
                        res.send(err);
                    }
                    else{
                        res.status(401).json({
                            code: 10002,
                            error: err
                        })
                    }
                }
                else{
                    res.json({data:leaveType});
                }
            })
        }
    });
})

///------------------------//
router.route('/findByEmployeeID/:name')
    .get(function(req,res){
        logger.debug('Something is happen with entitle');
        var name = req.params.name;
        Employees.findOne({"_id":name},function(err,emp){
            if(err){
                if(configApi.checkVersion()){
                    res.send(err)
                }
                else{
                    res.status(401).json({
                        code: 10002,
                        error: err
                    })
                }
            }
           else{
                LeaveEntitlement.find({"employee.employee_id": emp.employeeId},function(err, entitle) {
                    if (err) {
                        if(configApi.checkVersion()){
                            res.send(err);
                        }
                        else{
                            res.status(401).json({
                                code: 10002,
                                error: err
                            })
                        }
                    }
                    else{
                        res.json(entitle);
                        logger.debug(entitle);
                    }
                });
            }
        })
    })
router.route('/id/:id/:name')
    .get(function(req,res) {
        logger.debug('get value of leave type ');

        var id = req.params.id;
        var name = req.params.name;
        Employees.findOne({"_id":name},function(err,emp){
            if(err){
                if(configApi.checkVersion()){
                    res.send(err)
                }
                else{
                    res.status(401).json({
                        code: 10002,
                        error: err
                    })
                }
            }
            else{
                LeaveEntitlement.find({"leaveType.leavetype_id": id, "employee.employee_id": emp.employeeId}, function (err, entitle) {
                    if (err) {
                        if(configApi.checkVersion()){
                            return res.json({message: err});
                        }
                        else{
                            res.status(401).json({
                                code: 10002,
                                error: err
                            })
                        }
                    }
                    else{
                        res.json(entitle);
                    }
                })
            }
        })
    })
router.route('/:id')
.delete(function(req, res) {
    var id = req.params.id;
    LeaveEntitlement.remove({_id: id}, function(err, id) {
        if (err) {
            if(configApi.checkVersion()){
                res.send(err)
            }
            else{
                res.status(401).json({
                    code: 10002,
                    error: err
                })
            }
        }
        else{
           if(configApi.checkVersion()){
               res.json({
                   message: 'Entitle deleted successful'
               });
           }
            else{
               res.json({
                   success: 'Entitle deleted successful'
               });
           }
        }
    });
})
//find entitlement with employeeid
router.route('/findByEmployeeIdAndLeaveTypeIdAndLeavePeriodId')
    .post(function(req, res) {
        var entitle = req.body;
        logger.debug('check entitle')
        LeaveEntitlement.findOne({ 'employee.employee_id':entitle.employeeId,
            'leaveType.leavetype_id':entitle.leaveTypeId,'leavePeriodId' :entitle.leavePeriodId, 'entitlementDay': entitle.entitlementDay }, function(err, entitle) {
            if (entitle) {
                logger.error('error')
                res.json({
                    message: 'error'
                });
            }
            else{
                logger.debug('success')
                res.json({
                    success: 'sucess'
                });
            }
        });
    }),
router.route('/findByEmployeeIdAndLeaveTypeId')
    .post(function(req, res) {
        var entitle = req.body;
        logger.debug('check entitle leavetype')
        LeaveEntitlement.findOne({ 'employee.employee_id':entitle.employeeId,
            'leaveType.leavetype_id':entitle.leaveTypeId}, function(err, entitle) {
            if (entitle) {
                logger.error('error')
                res.json({
                    message: 'error'
                });
            }
            if(!entitle){
                logger.debug('success')
                res.json({
                    success: 'success'
                });
            }
        });
    })
router.route('/findById/:id')
    .get(function(req,res){
        logger.debug('get id of entitle');
        var id = req.params.id;
            LeaveEntitlement.findOne({_id: id},function(err, entitle) {
                if (err) {
                    if(configApi.checkVersion()){
                        res.send(err);
                    }
                    else{
                        res.status(401).json({
                            code: 10002,
                            error: err
                        })
                    }
                }
                else{
                    res.json(entitle);
                    logger.debug(entitle);
                }
            });
    })
export default router;


