import express from 'express';
import Roles from '../models/RoleModel';
import Permissions from '../models/PermissionModel';
import PermissionJson from '../data/permission.json';
import defaultRole from '../data/defaultRole.json'
import configApi from '../config/api.js';
import logger from '../../Server/utils/logger.js';
const router = express.Router();
router.use(function(req, res, next) {
	logger.debug('Something is happening of role. ');
	//logger.debug(PermissionJson);
	next();
});
router.route('/getPermissionJson')
//get data json permission
	.get(function(req,res){
		logger.debug("to service get data json permission");
		res.json(PermissionJson);
	})
router.route('/')
//create a new role
	.post(function(req,res){
        var role = new Roles();
        role.name = req.body.userRole;
        role.type.roleTypeId = req.body.userRoleType;
        role.type.nameType=req.body.nameRoleType;
        role.permissions = req.body.Permission;
        logger.debug(role.permissions);
        // new user need to have a name
        if (!req.body.userRole) {
            return res.status(400).send('userRole field is required!');
        }
        // check if user is already exist.
        Roles.findOne({
            'name': req.body.userRole
        }, function(err, result) {
            if (result) res.json({
                message: 'userRole already exists!'
            })
            else {
                role.save(function(err) {
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
                    res.json({
                        success: 'userRole created!'
                    });
                });
            }
        })
	})
	//get all role
	.get(function(req,res){
		// check role default
		Roles.findOne({
			'name': "Default Ess"
		}, function(err, result) {
			if (result) {logger.debug("Default ESS already exist")}
			else {
				var defaultEss = defaultRole[0]
				var role = new Roles()
				role.name = defaultEss.name
				role.type = defaultEss.type
				role.permissions = defaultEss.permissions
				logger.debug(role)

				role.save(function(err) {
					if (err) {
                        if(configApi.checkVersion()){
                            logger.error(err);
                        }
                        else{
                            res.status(401).json({
                                code: 10002,
                                error: err
                            })
                        }
                    }
                    else{
                        logger.debug("Default Ess add successful");
                    }
				});
			}
		})
		Roles.findOne({
			'name': "Default Supervisor"
		}, function(err, result) {
			if (result) {logger.debug("Default Supervisor already exist")}
			else {
				var defaultSupervisor = defaultRole[1]
				var role = new Roles()
				role.name = defaultSupervisor.name
				role.type = defaultSupervisor.type
				role.permissions = defaultSupervisor.permissions
				logger.debug(role)

				role.save(function(err) {
					if (err){
                        if(configApi.checkVersion()){
                            logger.error(err);
                        }
                        else{
                            res.status(401).json({
                                code: 10002,
                                error: err
                            })
                        }
                    }
					else{
                        logger.debug("Default Supervisor add successful");
                    }
				});
			}
		})
		// check role default
		Roles.find(function(err, roles) {
			if (err) {
                if(configApi.checkVersion()){
                    res.send(err);
                }
                else{
                    res.status(401).json({
                        code: 1002,
                        error: err
                    })
                }
            }
			else{
                res.json(roles);
            }
		});
	})
//update role
	.put(function(req,res){
		logger.debug("to service edit role");
		logger.debug(req.body._id);
		var role = new Roles();
		Roles.findOne({
			'_id': req.body._id
		}, function(err, role) {
			if (err) res.send(err);
			role.name = req.body.userRole;
			role.permissions = req.body.Permission;
			role.save(function(err) {
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
                            message: 'Role updated!'
                        });
                    }
                    else{
                        res.json({
                            success: 'Role updated!'
                        });
                    }
                }
			});
		});
	})
router.route('/:_id')
// delete a role
	.delete(function(req, res) {
		Roles.remove({
			_id: req.params._id
		}, function(err, _id) {
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
                        message: 'Role Successfully deleted'
                    });
                }
                else{
                    res.json({
                        success: 'Role Successfully deleted'
                    });
                }
            }
		});
	})
	//get a user with id
	.get(function(req,res){
		Roles.findOne({
			'_id': req.params._id
		}, function(err, role) {
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
                res.json(role);
                //logger.debug(role);
            }
		});
	})
router.route('/getDataPermissions')
	//get data permission
	.get(function(req, res) {
		// check if permission is already exist.
		Permissions.findOne({
			'permissions.label' : 'User'
		}, function(err, result) {
			if (result){
			//	logger.debug(result);
				return true;
			}
			else
			{
				Permissions.create({}, function(error, chart) {
					var permission=new Array("User","Role","Leave");
					for(var i=0;i < 3; i++)
					{
						chart.permissions.push({label:permission[i]});
					}
					chart.save(function(error, chart) {
                        if(error){
                            if(configApi.checkVersion()){
                                res.send(error)
                            }
                            else{
                                res.status(401).json({
                                    code: 10002,
                                    error: error
                                })
                            }
                        }
						else{
                            logger.debug('done');
                        }
					});

				});
			}
		});
		Permissions.find(function(err, permissions) {
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
                res.json(permissions);
            }
		});
	})
export default router;