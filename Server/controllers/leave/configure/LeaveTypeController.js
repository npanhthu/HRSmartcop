import express from 'express'
import LeaveTypes from '../../../models/LeaveTypeModel.js';
const router = express.Router();
import configApi from '../../../config/api.js';
import configError from '../../../config/error.js';
import logger from '../../../../Server/utils/logger.js';
router.route('/')
//create new a leave type
    .post(function(req,res){
        logger.debug(req.body.leavetype);
        var leaveType = new LeaveTypes();
        leaveType.leaveType = req.body.leavetype;
        leaveType.country = req.body.country;
        leaveType.color = req.body._color;
        LeaveTypes.findOne({
            $or:[{'leaveType':req.body.leavetype}, {color:req.body._color}]
        },function(err,result){
            if(result){
                if(configApi.checkVersion())
                {
                    res.json({message:"LeaveType or Color was existed, please choice another"});
                }
                else
                {
                    res.status(401).json({message:"LeaveType or Color was existed, please choice another"});
                }
            }else{
                leaveType.save(function(err){
                    if(err)
                    {
                         if(configApi.checkVersion())
                         {
                            res.send("Error");  
                         }
                          else
                          {
                            res.status(401).json({
                                code: 10002,
                                error: err
                            })
                          }
                    } 
                    else
                    {
                        if(configApi.checkVersion())
                        {
                             res.json({message:"LeaveType added success"});  
                        }
                        else
                        {
                            res.status(200).json({message:"LeaveType added success"}); 
                        }  
                    }
                    
                })
            }
        })
    })
    // get all leavetype
    .get(function(req,res){
        LeaveTypes.find(function(err, leaveType) {
            if (err)
            {
                if(configApi.checkVersion())
                {
                    res.send(err);      
                }
                else
                {
                    res.status(401).json({
                                code: 10002,
                                error: err
                            })
                }   
            } 
            else
            {
                if(configApi.checkVersion())
                {
                 res.json(leaveType);
                return;   
                }
                else
                {
                    res.status(200).json(leaveType);
                    return;  
                }
            }
            
        });
    })
    //update a leavetype
.put(function (req, res) {
        LeaveTypes.find({color: req.body._color}, function (err, object) {
            if (err) {
                res.send(err);
                return;
            } else if (object) {
                for (var i = 0; i < object.length; i++) {
                    if (object[i]._id != req.body.identify) {
                        if(configApi.checkVersion())
                        {
                           res.json({message: "Color was exited, please choice another"})
                           return; 
                        }
                        else
                        {
                            res.status(401).json({message: "Color was exited, please choice another"})
                           return;
                        }
                    }
                }
            }
            LeaveTypes.findById(req.body.identify, function (err, result) {
                if (result) {
                    result.leaveType = req.body.leavetype;
                    result.country = req.body.country;
                    result.color = req.body._color;
                    logger.debug(result);
                    result.save(function (err) {
                        if (err) {
                            if(configApi.checkVersion())
                            {
                               res.send(err); 
                            }
                            else
                            {
                                res.status(401).json({
                                code: 10002,
                                error: err
                            })
                            }
                        }
                        if(configApi.checkVersion())
                        {
                            res.json({message: "Update successful"});
                            return;
                        }
                        else
                        {
                             res.status(200).json({message: "Update successful"});
                            return;
                        }  
                    })
                }
                else {
                    if(configApi.checkVersion())
                    {
                        res.send("error");    
                    }
                    else
                    {
                        res.status(401).json({
                                code: 10002,
                                error: "ERror"
                            })
                    }
                }
            })
        })
    })
router.route('/findByIdentify/:identify')
    .get(function(req,res){
        var id = req.params.identify;
        LeaveTypes.findById(id,function(err,result){
            if(err)
            {
              if(configApi.checkVersion())
              {
                res.send(err); 
              }
               else
               {
                 res.status(401).json({
                                code: 10002,
                                error: err
                            })
               }
            } 
            else{
                if(configApi.checkVersion())
                {
                    res.json({data:result})
                return;    
                }
                else
                {
                    res.status(200).json({data:result})
                return;   
                }
                
            }
        })
    })

router.route('/:_id')
// delete a leavetype
    .delete(function(req, res) {
        LeaveTypes.remove({
            _id: req.params._id
        }, function(err, _id) {
            if (err)
            {
                if(configApi.checkVersion())
                {
                    res.send(err)      
                }
                else
                {
                   res.status(401).json({
                                code: 10002,
                                error: err
                            }) 
                }
            } 
            if(configApi.checkVersion())
            {
              res.json({
                message: 'LeaveType Successfully deleted'
             }); 
            }
            else
            {
                res.status(200).json({
                message: 'LeaveType Successfully deleted'
             }); 
            }
        });
    })
export default router;