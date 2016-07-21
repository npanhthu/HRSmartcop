import express from 'express';
import Users from '../../models/UserModel';
import _    from 'lodash';
import jwt  from 'jsonwebtoken';
import config from  '../../config/config';
import Roles from '../../models/RoleModel';
import LdapStrategy  from 'passport-ldapauth';
import passport from 'passport';
const router = express.Router();
import defaultRole from '../../data/defaultRole';
import Employees from '../../models/EmployeeModel.js';
import cookieParser from 'cookie-parser';
import logger from '../../../Server/utils/logger.js';
router.use(function(req, res, next) {
	logger.debug('Something is happening in auth. ');
	next();
});
var OPTS = {
  server: {
    url: 'ldap://ldap.smartdev.vn/phpldapadmin',
    bindDn: 'cn=admin,dc=smartdev,dc=vn',
    bindCredentials: '123456',
    searchBase: 'dc=smartdev,dc=vn',
    searchFilter: '(mail={{username}})'
  }
};
passport.use(new LdapStrategy(OPTS));
function createToken(user) {
	return jwt.sign(user, config.secret);
}
router.route('/')
  .post(function(req,res,next)
  {
    var nameFilter=req.body.username;
    if (nameFilter.search('@smartdev.vn') == -1)
    {
       //system signin
        Users.findOne({ username: req.body.username}, function (err, user){
          if (err)
            logger.error(err);
          if (!user) {
            return res.status(401).json({"message":"The username or password don't match"});
          }
          if (user.password !== req.body.password) {
            return res.status(401).json({"message":"The username or password don't match"});
          }
          if(user.status== 0){
            return res.status(401).json({"message":"The username is Disabled"});
          }
          sendUserRole(res,user)
        });
      //system signin
    }
    else
    {
       //ldap signin
  passport.authenticate('ldapauth', {session: false}, function(err, user, info) {
    logger.debug("Something is happening with LDAP Server");
    if (err) {
    logger.error(err);
    }
    if (! user) {
      logger.debug("invalid credentials");
      return res.status(401).json({"message":"You use smartdev account.The username or password don't match."});
    }
    if(user)
    {
       var that=this;
      var userSystem = new Users()
        userSystem.userrole = {}
      Roles.findOne({'name': defaultRole[0].name},'permissions', function(err, result) {
          if(result)
            {userSystem.userrole.essrole = result._id;
                Roles.findOne({'name': defaultRole[1].name},'permissions', function(err, result) {
                    if (result)
                    {userSystem.userrole.supervisorrole= result._id;}
                });
            }
        });

      Users.findOne({
        'username': user.mail
       }, function(err, result) {
        if (result){
            logger.debug("User already exist");
            var _object={};
            _object.user=result;
            Roles.find({_id:userSystem.userrole.essrole}, 'permissions',function(err,roles){
                _object.role={};
                _object.role.essrole=roles;
                Roles.find({_id:userSystem.userrole.supervisorrole}, 'permissions',function(err,roles){
                    _object.role.supervisorrole=roles;
                        _object.role.adminrole='';
                        var token=createToken(_object);
                        res.status(201).send({id_token:token});
                })
            })
        } else {
          var _employeeId='';
          var that=this;
          Employees.find({'employeeId':/SMD/i }).sort({"employeeId": -1}).exec(function(err, emps) {
            logger.debug('Employee not found. Create new one');

            if (emps.length) {
              if (!emps[0].employeeId) {
                  _employeeId = 'SMD0001'
              } else {
                  var maxID = emps[0].employeeId.substring(3, 7)
                  var indexId = parseInt(maxID) + 1;
                  var _employeeId = '0' + indexId;
                  while (_employeeId.length < 4) {
                      _employeeId = '0' + _employeeId;
                  }
                  _employeeId = 'SMD' + _employeeId;
              }
            } else {
              _employeeId = 'SMD0001';
            }
            userSystem.username = user.mail;
            userSystem.email = user.mail;
            userSystem.password="";
            userSystem.status=1;
            userSystem.accType=1;
            userSystem.employeeId = _employeeId;
            
            var _object={};
            _object.user=userSystem;
            Roles.find({_id:userSystem.userrole.essrole}, 'permissions',function(err,roles){
              _object.role={};
              _object.role.essrole=roles;
              Roles.find({_id:userSystem.userrole.supervisorrole}, 'permissions',function(err,roles){
                  _object.role.supervisorrole=roles;
                  _object.role.adminrole='';
                  var token=createToken(_object);
                  res.status(201).send({id_token:token});
              })
          })
        userSystem.save(function(err) {
          if (err) return logger.error(err)
        });
          //add empployee to user
        var employee = new Employees();
        employee.firstName = user.givenName;
        employee.lastName = 'SmartDev';
        employee.location = '189';//vietname
        employee.isArchive = 1;
        employee.employeeId = _employeeId;
        employee.imageUpload = ' ';
        employee.save(function(error) {
            if (error) {logger.error(error);}
            logger.debug("Employee created");});
        });
        }
      
       })                  
    }
  })(req,res,next);
  //ldap signin
    }
  })
function sendUserRole(res,user){
  var _object={};
  _object.user=user;
  Roles.find({_id:user.userrole.essrole}, 'permissions',function(err,roles){
    _object.role={};
    _object.role.essrole=roles;
    Roles.find({_id:user.userrole.supervisorrole}, 'permissions',function(err,roles){
      _object.role.supervisorrole=roles;
      Roles.find({_id:user.userrole.adminrole}, 'permissions',function(err,roles){
        _object.role.adminrole=roles;
        var token=createToken(_object);
        res.status(201).send({id_token:token});
      })
    })
  })
}
export default router;