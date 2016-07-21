import express from 'express'
import Works from '../../../models/WorkModel';
const router = express.Router();

//work week service
router.route('/').post(function(req,res){
    var _works=new Works();
    _works.workCountry=req.body.workCountry;
    _works.workWeeks=req.body.workWeeks;
    Works.findOne({workCountry:req.body.workCountry},function(err,work){
        if(!work){
            _works.save();
            res.json({success:"Save Success"})
        }else{
            Works.update({workCountry:req.body.workCountry},{$set:{workWeeks: _works.workWeeks}},function(err,work){
                res.json({success:"Update Success"})
            });
        }
    });
})
router.route('/:workCountry').get(function(req,res){
    var _workCountry = req.params.workCountry;
    Works.findOne({workCountry:_workCountry},function(err,work){
        if(err)
        {
          res.json({messager:err,success:false});
        }
        else {
          res.json(work);
        }
    })
})

export default router;
