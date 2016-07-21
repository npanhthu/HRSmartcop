import express from 'express';
import config from  '../../config/config';
import jwt_decode from 'jwt-decode';
import Users from '../../models/UserModel';
exports.verify=function(token, callback)
{
  var _object=jwt_decode(token);
  Users.findById(_object.user._id, function(err, user) {
      callback(err, user);
    });
}
