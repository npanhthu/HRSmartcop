import express from 'express';
var mongoose = require('mongoose');
import Employees from '../models/EmployeeModel.js';
import LeaveEntitle from '../models/LeaveEntitlementModel.js'
import LeaveList from '../models/AssignLeaveModel.js'
import configApi from '../config/api.js';
import configError from '../config/error.js';
import logger from '../../Server/utils/logger.js';
const router = express.Router();
router.route('/autoGenerateEmployeeId')
    .get(function(req, res) {
    var _employeeId = '';
    Employees.find({'employeeId':/SMC/i }).sort({employeeId: 'desc'}).exec(function(err, emps) {
        if (emps.length) {
            if (!emps[0].employeeId) {
                res.json({objectId: 'SMC0001'})
            } else {
                var maxID = emps[0].employeeId.substring(3, 7)
                var indexId = parseInt(maxID) + 1;
                var _employeeId = '0' + indexId;
                while (_employeeId.length < 4) {
                    _employeeId = '0' + _employeeId;
                }
                _employeeId = 'SMC' + _employeeId;
                res.json({objectId: _employeeId})
            }
        } else {
            res.json({objectId: 'SMC0001'})
        }
    });
})
//GET AN EMPLOYEE WITH ID
router.route('/:employeeId')
    .get(function(req, res) {
    var _employeeId = req.params.employeeId;
    Employees.findOne({employeeId: _employeeId}, function(err, employee) {
        if(employee){
            res.json(employee);
        }
        else{
            if(configApi.checkVersion()){
                res.send(err)
            }
            else{
                res.status(401).json({
                    code:10002,
                    error: err
                })
            }
        }
        return;
    });
})
router.route('/')
//create a new employee
    .post(function(req, res) {
        var employee = new Employees();
        employee.employeeId = req.body.employeeId;
        employee.firstName = req.body.firstName;
        employee.lastName = req.body.lastName;
        employee.location = req.body.location;
        employee.leaveBalance = 0;
        employee.isArchive = 1;
        employee.imageUpload = req.body.imageUpload;
        employee.bloodGroup = req.body.bloodGroup;
        //logger.debug(req.body);
        // new user need to have a name
        if (!req.body.firstName) {
            return res.status(400).send('FirstName field is required!');
        }
        if (!req.body.lastName) {
            return res.status(400).send('LastName field is required!');
        }
        if (!req.body.location) {
            return res.status(400).send('Location field is required');
        }
        //save data to database
        employee.save(function(error) {
            if (error) {
                if(configApi.checkVersion()){
                    logger.error(error);
                    return res.json({message: "error"});
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
                    logger.debug("Employee created");
                    res.json({message: "Create new employee success"});
                }
                else{
                    logger.debug("Employee created");
                    res.json({success: "Create new employee success"});
                }
            }
        });
})
//get all employee
    .get(function(req, res) {
        Employees.find({isArchive: 1}, function(err, employees) {
            logger.debug("employee ");
            if (employees){
                res.json(employees);
            }
            else{
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
            return;
        })
})

router.route('/update')
    //update a employee
    .post(function(req, res) {
        // body...
        logger.debug('update employee');
        var employee = new Employees();
        Employees.findOne({employeeId: req.body.employeeId}, function(err, employee) {
            if (err) 
            {
                res.send(err);
            }
            else
            {
            employee.firstName = req.body.firstName;
            employee.lastName = req.body.lastName;
            employee.DLNumber = req.body.DLNumber;
            employee.licenseExpiryData = req.body.licenseExpiryData;
            if (req.body.gender)
            {
                employee.gender = req.body.gender;
            }
            else
            {
                employee.gender = -1;
            }
            employee.maritalStatus = req.body.maritalStatus;
            employee.nationality = req.body.nationality;
            employee.dateOfBirth = req.body.dateOfBirth;
            employee.nickName = req.body.nickName;
            employee.bloodGroup = req.body.bloodGroup;
            employee.imageUpload = req.body.imageUpload;
            employee.save(function(err) {
                if (err){
                    if(configApi.checkVersion()){
                        res.send(err);
                    }
                    else{
                        res.status(401).json({
                            code : 10002,
                            error: err
                        })
                    }
                }
                else{
                    if(configApi.checkVersion()){
                        res.json({message: 'Employee updated'})
                    }
                    else{
                        res.json({success: 'Employee updated for ios'})
                    }
                }
            });
            }
        })
    })
router.route('/notArchive/:employeeId')
    .get(function(req, res) {
        var _employeeId = req.params.employeeId;
        LeaveEntitle.remove({'employee.employee_id': _employeeId},function(err,entitle){
            if(err)res.send(err)
            LeaveList.remove({'employeeId': _employeeId},function(err,assign){
                if(err)res.send(err)
                Employees.update(
                    {employeeId: _employeeId},
                    {$set: {isArchive: 0}}, function(err, emp) {
                        if (err) {
                            if(configApi.checkVersion()){
                                res.send({Error: err});
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
                                res.json({message: "OK"})
                            }
                            else{
                                res.json({success: "OK"})
                            }
                        }
                    }
                )
            })
        })
    })
export default router;