import express from 'express';
import config from '../config/config.json'
import AssignLeaves from '../models/AssignLeaveModel.js';
import nodemailer from 'nodemailer';
import Employees from '../models/EmployeeModel.js';
import Users from '../models/UserModel';
import logger from '../../Server/utils/logger.js';

const router = express.Router();
router.use(function(req, res, next) {
	logger.debug('Something is happening of role. ');
	//logger.debug(PermissionJson);
	next();
});

router.route('/approve-assign')
    .post(function(req,res){
	var _data=req.body;
		AssignLeaves.update({_id:_data._id},{$set:{status: _data.status}},function(err,doc){
			res.json({message:'successful'});

			AssignLeaves.findOne({_id:_data._id},function(err,data){
				Employees.findOne({employeeId: data.employeeId}, function(err,employee){
					Users.findOne({employeeId: employee.employeeId}, function(err, user){
						//-------this is sending mail for employee
						var transporter = nodemailer.createTransport({
						service: 'Gmail',
						auth: {
							user: config.mail,
							pass: config.pass,
							}
							});
						var msg;
						if(_data.status==1){
							msg= 'approved';
						}
						if(_data.status==2){
							msg= 'rejected';
						}
						if(_data.status==3){
							msg= 'canceled';
						}

			// Message object
				var message = {

				// sender info
				from: 'Smart Corp <smartcorpkfc@gmail.com>',

				// Comma separated list of recipients
				to: '"Receiver Name" '+user.email,

				// Subject of the message
				subject: 'Change status of require leave ✔', //

				headers: {
					'X-Laziness-level': 1000
				},

				// plaintext body
				text: 'Hi',

				// HTML body
				html: '<p>Hello, '+employee.firstName+' '+employee.lastName+'</p>' +
				'<p>I am writing to inform you that your leave had been changed! '+
				'<p>Your assign has been '+msg+' </p>'+
				'start date: '+data.start_date+' to '+data.end_date +'</p>'+
				'<p>If you have any question, let me know!</p>'+
				'<p> Best regards!</p>'+
				'<p> Supervisor </p>'
				,
				// Apple Watch specific HTML body
				watchHtml: '',
				// An array of attachments
				attachments: []
			};

			logger.debug('Sending Mail');
			transporter.sendMail(message, function(error, info) {
				if (error) {
					return;
				}
				logger.debug('Message sent successfully!');
				logger.debug('Server responded with "%s"', info.response);
			});
			})
	});/// end findOne employee
});//end findOne assignlive

});
})


export default router;