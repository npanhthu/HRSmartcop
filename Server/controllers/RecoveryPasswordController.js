/**
 * Created by ryu on 07/08/2015.
 */
import express from 'express';
import Users from '../models/UserModel';
import _    from 'lodash';
import jwt  from 'jsonwebtoken';
import config from  '../config/config';
import Roles from '../models/RoleModel';
const router = express.Router();
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var async = require('async');
import logger from '../../Server/utils/logger.js';

function createToken(user) {
    return jwt.sign(_.omit(user, 'password'), config.secret, { expiresInMinutes: 1});
}
router.route('/forget/:email')
    .get(function(req, res, next) {
    var email = req.params.email;
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            Users.findOne({ email: email }, function(err, user) {
                if (err) logger.error(err)
                if (!user) {
                    res.json({
                        message: 'This email does not match with any account!!'
                    });
                }
                if(user){
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(function(err) {
                        done(err, token, user);
                    });
                }
            });
        },
        function(token, user, done) {
            var transport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: config.mail,
                    pass: config.pass
                }
            });
            var mails = {
                to: email,
                from: 'Smart Corp <smartcorpkfc@gmail.com>',
                subject: 'SmartCorp Password Reset Request',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/#/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            transport.sendMail(mails, function (err) {
                if(err) logger.debug('mail was not been send')
                else{
                    res.json({
                        success: 'Password reset was been send to mail ' + email + ' .Please check your mail to continue'
                    });
                }
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/forget/:email');
    });
});
router.route('/reset/:token')
    .get(function(req, res) {
        logger.debug('check token')
        Users.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                logger.debug('error')
                res.json({
                    message: 'Password reset token is invalid or has expired. Please try again'
                });
            }
            if(user){
                logger.debug('success')
                res.json({
                    success: 'Valid token'
                });
            }
        });
    }),
    router.route('/changepass')
        .put(function(req,res){
            logger.debug('change pass')
            logger.debug(req.body.password)
            Users.findOne({resetPasswordToken: req.body.resetPasswordToken},function(err,user){
                if(user){
                    user.password = req.body.password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        var transport = nodemailer.createTransport({
                            service: 'Gmail',
                            auth: {
                                user: config.mail,
                                pass: config.pass
                            }
                        });
                        var mails = {
                            to: user.email,
                            from: 'Smart Corp <smartcorpkfc@gmail.com>',
                            subject: 'Your password has been changed',
                            text: 'Hello,\n\n' +
                            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                        };
                        transport.sendMail(mails, function(err) {
                            if(!err){
                                res.json({
                                    success: 'Success!! Your password has been changed'
                                });
                            }
                        });

                    });
                }
            })
        })

router.route('/')
export default router;
