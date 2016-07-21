
import express from 'express'
import AssignLeaves from '../../models/AssignLeaveModel.js';
import logger from '../../../Server/utils/logger.js';
const router = express.Router();
    

router.route('/')
// create a new assign leave
    .post(function(req,res){
        var _data = req.body;
        logger.debug("data is ");
        logger.debug(_data);
            AssignLeaves.find({employeeId:_data._employeeId}, function(err, result){
                if(err){
                    logger.error("error", err);
                    res.json({msg:"Sorry we meet a problem in process, please try again later",success:false});
                    return;
                }
                for(var i=0;i<result.length;i++){
                    if(!((_data._fromDate < result[i].start_date && _data._toDate < result[i].start_date) || (_data._fromDate> result[i].end_date && _data._toDate > result[i].end_date))){
                        res.json({msg:"Sorry the date assigned, please choice another date",success:false});
                        return;
                    }
                }
                var _assign = new AssignLeaves();
                _assign.employeeId = _data._employeeId;
                _assign.leaveTypeId = _data._leaveTypeId;
                _assign.start_date = _data._fromDate;
                _assign.end_date = _data._toDate;
                _assign.durationFrom = _data._fromTime;
                _assign.durationTo = _data._toTime;
                _assign.text = _data._comment;
                _assign.color = _data._color;
                _assign.user = _data._user;
                _assign.leaveType = _data._leaveType;
                if(_data._status == null)
                {
                    _assign.status=0;
                }
                else{
                    _assign.status = _data._status;
                }
                _assign.save(function(err){
                    if(err){
                        logger.error("error", err);
                        res.json({msg:"Sorry we meet a problem in process, please try again later",success:false});
                        return;
                    }else{
                        res.json({msg:"Success",success:true,type:'create'});
                        return;
                    }
                })
            });
    })

.put(function(req,res){
        var _data = req.body;
        logger.debug("data is");
        logger.debug(_data);
            AssignLeaves.findById(_data._identify, function(err,result){
                if(err){
                    res.json({msg:"Sorry we meet a problem in process, please try again later",success:false}); return;
                }else if(result){
                    result.employeeId = _data._employeeId;
                    result.leaveTypeId = _data._leaveTypeId;
                    result.start_date = _data._fromDate;
                    result.durationFrom = _data._fromTime;
                    result.end_date = _data._toDate;
                    result.durationTo = _data._toTime;
                    result.text = _data._comment;
                    result.user = _data._user;
                    result.leaveType = _data._leaveType;
                    AssignLeaves.find({employeeId: req.body._employeeId}, function(err,array){
                        if(err){
                            res.json({msg:"Sorry we meet a problem in process, please try again later",success:false}); return;
                        }else if(array){
                            for(var i=0;i<array.length;i++){
                                logger.debug("array at i " + array[i]._id);
                                logger.debug("data " + _data._identify);
                                if(array[i]._id != _data._identify){
                                    if(!((_data._fromDate < array[i].start_date && _data._toDate < array[i].start_date) || (_data._fromDate> array[i].end_date && _data._toDate > array[i].end_date))){
                                        res.json({msg:"Sorry the date assigned, please choice another date",success:false});
                                        return;
                                    }
                                }
                            }
                            logger.debug("save update ");
                            result.save(function(err) {
                                if (err) {res.json({msg:"Sorry we meet a problem in process, please try again later",success:false}); return;}
                                else{
                                    res.json({msg: 'Update successful',success:false,type:'update'});
                                    return;
                                }
                            });
                        }
                    })
                }
            })
    })
//get all assign leave
.get(function(req,res){
        AssignLeaves.find(function(err, list) {
            if (err) res.send(err);
            res.json(list);
        });
    })
//delete a assign
router.route('/:id')
    .delete(function(req,res){
        var temp = req.params.id;
        logger.debug("temp is " + temp);

        AssignLeaves.remove({_id:temp}, function(err){
            if(err) {
                res.send({msg:"Have error when try to delete this assign",success:false});
                return;
            }else{
                logger.debug("OK");
                res.json({msg:"Delete successful",success:true})
                return;
            }
        })
    })

//get assign by employee
router.route('/findByEmployeeId/:employeeID')
    .get(function(req,res){
        var _employeeID = req.params.employeeID;
        logger.debug("employee Id is " + _employeeID);
        AssignLeaves.find({employeeId:_employeeID}, function(err,list){
            if(err){res.send(err)}
            res.json(list);
            return;
        })
    })


export default router;