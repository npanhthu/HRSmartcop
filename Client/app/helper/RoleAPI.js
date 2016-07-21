// The API layer which handles the actual syncing of Todos  with the server
import $ from 'jquery';
import Constants from '../constants/RoleConstants';
import Dispatcher from '../AppDispatcher.js';
var hostName=window.location.hostname;
const BASE_URL = 'http://'+hostName+':3007/api/role/';
$.ajaxSetup({
  xhrFields: {
      withCredentials: false
   }
});
const RoleApi = {
  getPermissionJson:function(success,failure,result)
  {
    console.log('to helper get permission json');
    $.ajax({
      url: BASE_URL + 'getPermissionJson',
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        success(data);
        result();
      },
      error: function(xhr, status, error) {
        failure(error);
      }
    });
  },
  create: function(role, success, failure,showMsg) {
    $.ajax({
      url: BASE_URL,
      type: 'POST',
      dataType: 'json',
      data: role,
      success: function(data)
      {
        success(data);
        showMsg();
      },
      error: function(data) {
       failure();
      }
    });
  },
  getAll: function(success, failure,getUser) {
    $.ajax({
      url: BASE_URL,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        success(data);
        getUser();
       console.log(data);
      },
      error: function(xhr, status, error) {
        failure(error);
      }
    });
  },
  getDataPermissions:function(success, failure,getPermissions) {
      $.ajax({
        url: BASE_URL+'getDataPermissions',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
          success(data);
          getPermissions();
        },
        error: function(xhr, status, error) {
          failure(error);
        }
      });
    }
    ,
  getDataRoleEdit:function(id,success,failure,loadRole)
  {
    $.ajax({
      url: BASE_URL +id,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        success(data);
        loadRole();
      },
      error: function(xhr, status, error) {
        failure(error);
      }
    });
  }
    ,
    updateRole:function(role,success,error,showMsg)
    {
      $.ajax({
        url: BASE_URL,
        type: 'PUT',
        dataType: 'json',
        data: role,
        success: function(data)
        {
          success(data);
          showMsg();
        },
        error: function(data) {
          failure();
        }
      });
    }
    ,
  destroy: function(id, success, failure,resetCheckbox) {
    $.ajax({
      url: BASE_URL + id,
      type: 'DELETE',
      dataType: 'json',
      success: function(data) {
        console.log(data);
        success(data);
        resetCheckbox();
      },
      error: function(xhr, status, error) {
        failure(error);
      }
    });
  }
};

export default RoleApi;