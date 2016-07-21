import express from 'express';
import Users from '../models/UserModel';
import _    from 'lodash';
import jwt  from 'jsonwebtoken';
import config from  '../config/config';
import Roles from '../models/RoleModel';
import Employee from '../models/EmployeeModel.js'
import LeaveEntitle from '../models/LeaveEntitlementModel.js'
import LeaveList from '../models/AssignLeaveModel.js'
import defaultRole from '../data/defaultRole';
import configApi from '../config/api.js';
import configError from '../config/error.js';
import logger from '../../Server/utils/logger.js';

const router = express.Router();
router.use(function(req, res, next) {
    logger.debug('Something is happening with users controller. ');
    next();
});
router.route('/')
    // create a new user (accessed at POST http://domain/api/user)
    .post(function(req, res) {
        var user = new Users();
        var checkMail = true
        if(req.body.userrole.essrole == ""){
            checkMail = false
            Roles.findOne({'name': defaultRole[0].name},'permissions', function(err, result) {
                if(result)
                {user.userrole.essrole = result._id;
                    Roles.findOne({'name': defaultRole[1].name},'permissions', function(err, result) {
                        if (result)
                        {
                            user.userrole.supervisorrole= result._id;
                            user.userrole.adminrole = req.body.userrole.adminrole
                        }
                    });
                }
            });
        }
        else{
            user.userrole = req.body.userrole;
        }
        user.username = req.body.username;
        user.password = req.body.password;
        user.status = req.body.status;
        user.employeeId=req.body.employeeId;
        user.email = req.body.email;
        user.accType=0;
        // new user need to have a name
        if (!req.body.username) {
            if (configApi.checkVersion()) {
                return res.status(400).send('Name field is required!');  
            } else {
                return res.status(400).send({code: 10001, message: configError.getMessage(10001)});
            }
            
        }
        //check if employee is exits.
        Users.find({employeeId:req.body.employeeId}, function(err,object){
            if(err){
                if(configApi.checkVersion()){
                    res.send(err);
                    return;
                }
                else{
                    res.status(401).json({
                        code: 10002,
                        error: err
                    })
                }
            }
            if(object.length>0){
                if(configApi.checkVersion())
                {
                    res.json({message: 'Employee already exists!'})
                     return;
                }
                else
                {
                    res.status(401).json({
                                        code : 10002,
                                        error: 'employee already exists!'
                                    })
                }
            }
            // check if user is already exist.
            Users.findOne({
                'username': req.body.username
            }, function(err, result) {
                if (result)
                {
                    if(configApi.checkVersion())
                    {
                         res.json({
                             message: 'Users already exists!'
                          })
                    }
                    else
                    {
                        res.status(401).json({
                                        code : 10002,
                                        message: 'Users already exists!'
                                    })
                    }
                }
                
                else {
                    if(checkMail==false){
                        user.save(function(err) {
                            if (err) {
                                if(configApi.checkVersion()){
                                    return logger.error(err)
                                }
                                else{
                                    res.status(401).json({
                                        code : 10002,
                                        error: err
                                    })
                                }
                            }
                            else{
                                res.json({
                                    success: 'Users created!'
                                });
                            }
                        });
                    }
                    else{
                        Users.findOne({'email': req.body.email},function(err,users){
                            if(users){
                                if(configApi.checkVersion()){
                                    res.json({message: 'This email has been used for another user'})
                                }
                                else{
                                    res.json({success: 'This email has been used for another user'})
                                }
                            }
                            else{
                                user.save(function(err) {
                                    if (err) {
                                        if(configApi.checkVersion()){
                                            return logger.error(err)
                                        }
                                        else{
                                            res.status(401).json({
                                                code: 10002,
                                                error: err
                                            })
                                        }
                                    }
                                    else{
                                        res.json({
                                            success: 'Users created!'
                                        });
                                    }
                                });
                            }
                        })
                    }
                }
            })
        })
    })
    // get all the users (accessed at GET http://localhost/api/users)
    .get(function(req, res) {
        Users.find(function(err, users) {
            if (users) {
                res.json(users);
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
        });
    })
    // update the username with a new username (accessed at PUT http://localhost:8080/api/users/username/:username)
    .put(function(req, res) {
        Users.find({employeeId:req.body.employeeId}, function(err,object){
            if(object){
                for(var i=0;i<object.length;i++){
                    if(object[i]._id != req.body.usernamepost){
                        if(configApi.checkVersion()){
                            if(configApi.checkVersion()){
                               res.json({error :'Employee was exited, please choice another'});
                            return; 
                            }
                            else
                            {
                                res.status(401).json({
                                code: 10002,
                                error: 'Employee was exited, please choice another'
                            })
                            }
                        }
                        else{
                            res.status(401).json({
                                code: 10002,
                                error: err
                            })
                        }
                    }
                }
            }
            else{
                if(configApi.checkVersion()){
                    res.send(err);
                    return;
                }
                else{
                    res.status(401).json({
                        code: 10002,
                        error: err
                    })
                }
            }
            Users.findOne({
                '_id': req.body.usernamepost
            }, function(err, user) {
                if (err){res.send(err);}
                else
                {
                    if(user.accType == 1)
                    {
                        user.userrole = req.body.userrole;
                        user.status = req.body.status;
                        user.save(function(err) {
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
                                res.json({
                                    success: 'User updated!'
                                });
                            }
                        });
                    }
                    else
                    {
                        user.userrole = req.body.userrole;
                        user.username = req.body.username;
                        user.password = req.body.password;
                        user.employeeId=req.body.employeeId;
                        user.status = req.body.status;
                        user.email = req.body.email;
                        user.save(function(err) {
                            if (err){
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
                                res.json({
                                    success: 'User updated!'
                                });
                            }
                        });

                    }
                }

            });
        })
    })
router.route('/findByUserName/:username')
    .get(function(req, res) {
        Users.findOne({
            'username': req.params.username
        }, function(err, user) {
            if(user){
                res.json(user);
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

        });
    })
router.route('/:userId')
// delete the user by the username (accessed at DELETE http://localhost:8080/api/users/username/:username)
    .delete(function(req, res) {
        Users.findOne({'_id': req.params.userId},function(err,user){
            if(err){
                res.send(err)
            }
            if(user){
                var id = user.employeeId
                LeaveEntitle.remove({'employee.employee_id': id},function(err,entitle){
                    if(err)res.send(err)
                    LeaveList.remove({'employeeId': id},function(err,assign){
                        if(err)res.send(err)
                        Employee.remove({'employeeId': id},function(err,emp){
                            if(err)res.send(err)
                            Users.remove({'_id': req.params.userId}, function(err, username) {
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
                                            message: 'Successfully deleted'
                                        });
                                    }
                                    else{
                                        res.json({
                                            success: 'Successfully deleted'
                                        });
                                    }
                                }
                            });
                        })
                    })
                })
            }
        })
    })
    // get the User with that id (accessed at GET http://localhost:8080/api/users/:user_id)
    .get(function(req, res) {
        Users.findById(req.params.userId, function(err, user) {
            if (err) {
                if (configApi.checkVersion()) {
                    res.send(err);
                } else {
                    res.status(401).json({
                        code: 10002,
                        error: err
                    });
                }
            } else {
                res.json(user);
            }
            return;
        });
    });

router.route('/disable/username/:userName')
    //disable a user
    .get(function(req,res) {
        // body...
        logger.debug('disable user'+req.params.userName);
        var user = new Users();
        Users.findOne({
            'username': req.params.userName
        }, function(err, user) {
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
                user.status = 0;
                user.save(function(err) {
                    if (err) {
                        if(configApi.checkVersion()){
                            res.send(err);
                        }
                        else{
                            res.status(401).json({
                                code: 401,
                                error: err
                            })
                        }
                    }
                    else{
                        if(configApi.checkVersion()){
                            res.json({
                                message: 'Status updated!'
                            });
                        }
                        else{
                            res.json({
                                success: 'Status updated!'
                            });
                        }
                    }
                });
            }
        });
    })
router.route('/findByEmployeeId/:employeeId')
//find user with employeeID
    .get(function(req,res){
        logger.debug("Employee id is " + req.params.employeeId);
        Users.findOne({employeeId:req.params.employeeId}, function(err, result){
            if(result){
                res.json(result.username);
                return;
            }
           else{
                if(configApi.checkVersion()){
                    res.send(err); return;
                }
                else{
                    res.status(401).json({
                        code: 10002,
                        error: err
                    })
                }
            }

        })
    })

export default router;