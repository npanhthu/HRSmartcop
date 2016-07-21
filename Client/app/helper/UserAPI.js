// The API layer which handles the actual syncing of Todos  with the server
import $ from 'jquery';
import Constants from '../constants/UserConstants';
import Dispatcher from '../AppDispatcher.js';
var hostName=window.location.hostname;
const BASE_URL = 'http://'+hostName+':3007/api/user/';
$.ajaxSetup({
  xhrFields: {
      withCredentials: false
   }
});
const UsersApi = {
  create: function(user, success, failure,showmsg) {
    $.ajax({
      url: BASE_URL,
      type: 'POST',
      dataType: 'json',
      data: user,
      success: function(data)
      {
        success(data);
        showmsg();
      },
      error: function(data) {
       failure();
      }
    });
  },

  destroy: function(username, success, failure,resetcheckbox) {
    $.ajax({
      url: BASE_URL +username,
      type: 'DELETE',
      dataType: 'json',
      success: function(data) {
        console.log(data);
        success(data);
        resetcheckbox();
      }
    });
  },
disable: function(username,success,failure,showmsg) {
    $.ajax({
      url: BASE_URL +'disable/username/'+username,
      dataType: 'json',
      success: function() {
        success();
      showmsg();
      },
      error: function(xhr, status, error) {
        failure(error);
      }
    });
  }
  ,

   getAll: function(success, failure,loadusers) {
    $.ajax({
      url: BASE_URL,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        success(data);
        loadusers();
      },
      error: function(xhr, status, error) {
        failure(error);
      }
    });
  },

  get: function(id, success, failure,loadUser) {
    $.ajax({
      url: BASE_URL + id,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        success(data);
        loadUser();
      },
      error: function(xhr, status, error) {
        failure(error);
      }
    });
  },
    getAUser:function(username,success,showMsg) {
        $.ajax({
            url: BASE_URL + 'findByUserName/' + username,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                success(data);
                showMsg();
                console.log(data);
            },
            error: function (err) {
                console.log(err);
            }
        });
    },
  update: function(user, success, failure,showMsg) {
      console.log("kakakakaka");
    $.ajax({
      url: BASE_URL,
      type: 'PUT',
      dataType: 'json',
      data: user,
      success: function(data) {
        success(data);
        console.log(data);
        showMsg();
      },
      error: function(xhr, status, error) {
        failure(error);
      }
    });
  },
    getUserName:function(employeeId, success, getData){
        console.log("helper " + employeeId);
        $.ajax ({
            url: BASE_URL + 'findByEmployeeId/' + employeeId,
            type: 'GET',
            dataType: 'json',
            success:function(data){
                success(data);
                getData();
            },
            error: function(err){
                console.log("Error: " + err);
            }
        })
    }
};

export default UsersApi;