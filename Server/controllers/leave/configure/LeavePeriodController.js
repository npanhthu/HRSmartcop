import express from 'express';
import Period from '../../../models/LeavePeriodModel';
import configApi from '../../../config/api.js';
import logger from '../../../../Server/utils/logger.js';
const router = express.Router();

router.route('/')
//create a new role
	.put(function(req,res){
        var period = new Period();
        period.month	= req.body.month;
        period.day		= req.body.day;
        period.start 	= req.body.start;
        period.end 		= req.body.end
        period.idPeriod =1;
        Period.findOne(function(err, per){
            if(per){
                Period.findOne({}, {}, { sort: { 'idPeriod' : -1 } }, function(err, per) {
                  if(err){
                    if(configApi.checkVersion()){
                        logger.error(err);
                    }
                      else{
                        res.status(401).json({
                            code: 10002,
                            error: err
                        })
                    }
                  }else{
                  period.idPeriod = per.idPeriod + 1;
                    Period.findOne({start:period.start},function(err,pre){
                        if(!pre){
                                period.save(function(err) {
                                if (err) {
                                    if(configApi.checkVersion()){
                                        res.send(err);
                                    }
                                    else{
                                        res.status(410).json({
                                            code: 10002,
                                            error: err
                                        })
                                    }
                                }
                               else{
                                    res.json({
                                        success: 'Save period success!'
                                    });
                                }
                            });
                        }else{
                            Period.update({start:period.start},{$set:{month:period.month,day:period.day, start: period.start, end: period.end}},function(err,pre){
                                if(err) {
                                    if(configApi.checkVersion()){
                                        return res.json({message: "Update Fail"});
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
                                        success: 'Update period success!'
                                    });
                                }
                            })
                        }

                    });
                    }
                });
            }else{
                period.idPeriod =1;
                period.save(function(err) {
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
                                success: 'Save period success!'
                            });
                        }
                    });
            }

        });
	})
	
	.get(function(req,res){
		Period.find({},{},{ sort: { 'start' : 1 }},function(err, data) {
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
                res.json(data);
            }
		});
	})
router.route('/getPeriodCurrentYear')
	.get(function(req,res){
		var year = new Date().getFullYear();

		var starts = new Date('01-02-'+year);
		
		Period.findOne({start: starts},function(err, period) {
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
                res.json(period);
            }
		});
	})
export default router;