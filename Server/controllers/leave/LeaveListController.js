import express from 'express'
import LeaveTypes from '../../models/LeaveTypeModel.js';
import AssignLeaves from '../../models/AssignLeaveModel.js';
import Works from '../../models/WorkModel';
import Employees from '../../models/EmployeeModel.js';
import Users from '../../models/UserModel.js';
import configApi from '../../config/api.js';
import logger from '../../../Server/utils/logger.js';
const router = express.Router();

router.route('/number-of-day')
    .post(function(req,res){
        logger.debug("data on server ");
        logger.debug(req.body);
        var sumNumber=req.body;
        var _totalDay=sumNumber.arrData;
        var error = '';
        for (var i = 0; i < _totalDay.length; i++) {
            AssignLeaves.update({_id:_totalDay[i]._id},{$set:{numberOfDay:_totalDay[i].numOfDays}},function(err,doc){
                logger.error(doc)
                if(err){
                    error = err;
                }
            })
        };
        if(error) {
            res.send(error);
        }else{
            res.json({Message: "Update successful"})
            return;
        }
    })

router.route('/getLeaveListByUserId/:UserId')
    .get(function(req,res){
        var userId = req.params.UserId;
        Users.findById(userId, function(err,object){
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
            }else{
                if(object){
                    AssignLeaves.find({user:object.username}, function(err,list){
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
                        }else{
                            res.json(list);
                            return;
                        }
                    })
                }else{
                    if(configApi.checkVersion())
                    {
                        res.json({message: 'Not exist userId'})
                        return;
                    }
                    else
                    {
                        res.status(401).json({
                            code : 10002,
                            error: 'Not exist userId!'
                        })
                    }
                }
            }
        })
    })
//Approve leave
function updateAssignLeave(){
    AssignLeaves.find(function(err,listAssign){
        for (var i = 0; i < listAssign.length; i++) {
            var _status = listAssign[i].status;
            if(_status==1){
                var _date = new Date();
                var _enddate=new Date(listAssign[i].end_date);
                if(_date>=_enddate){
                    AssignLeaves.update({_id:listAssign[i]._id},{$set: {status:4} }, function(err, doc){
                    });
                    var numberOfDate = listAssign[i].numberOfDay;
                    Employees.findOne({employeeId: listAssign[i].employeeId},function(err,employee){
                        var numberBalance = employee.leaveBalance + numberOfDate;
                            Employees.update({_id : employee._id},{$set:{leaveBalance: numberBalance}}, function(err,doc){
                        })
                    });
                }
            }
        };
    })
    setTimeout(function(){
        updateAssignLeave();
    }, 5000);
}
updateAssignLeave();

export default router;
