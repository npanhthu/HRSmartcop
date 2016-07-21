import $ from 'jquery';
import Constants from '../constants/RoleConstants';
import Dispatcher from '../AppDispatcher.js';
var hostName=window.location.hostname;
const BASE_URL = 'http://'+hostName+':3007/api/employee/';
$.ajaxSetup({
  xhrFields: {
      withCredentials: false
   }
});
const employeeAPI = {
  getEmployeeId: function(success,failure){
    $.ajax({
      url: BASE_URL+'/autoGenerateEmployeeId',
      type:'GET',
      success: function(data){
        success(data);
      },
      failure: function(xhr, status, error){

      }
    });
  },
  createEmployee: function(employee,success,getMsg) {
    $.ajax({
      url: BASE_URL,
      type: 'POST',
      dataType: 'json',
      data: employee,
      success: function(data)
      {
        success(data);
        getMsg(data);
      },
      error: function(err) {
       getMsg(err);
      }
    });
  },
  updateEmployee: function(employee,success,getMsg){
    $.ajax({
      url: BASE_URL+'update',
      type: 'POST',
      dataType: 'json',
      data: employee,
      success: function(data)
      {
        success(data);
        getMsg(data);
      },
      error: function(err) {
       getMsg(err);
      }
    });
  },
  getAnEmployee: function(employeeId,success,getData){
    $.ajax({
      url: BASE_URL+employeeId,
      type:'GET',
      success: function(data){
          success(data);
          getData(data);
      },
      error : function(xhr, status, error){
        
      }
    })
  },
  getAll: function(success,failure, getMsg){
    $.ajax({
        url: BASE_URL,
        type: 'GET',
        dataType: 'json',
        success: function(data){
            success(data);
            getMsg();
            console.log(data);
        },
        error: function(xhr, status, error){
            failure(error);
        }
    });
  },
  notArchive : function(id, success, reset){
      console.log("den api");
      $.ajax({
          url : BASE_URL + '/notArchive/' + id,
          dataType : 'json',
          type: 'GET',
          success: function(data){
              success(data);
              reset();
             // resetCheckBox();
              //console.log(data);
          },
          error : function(err){
              console.log("Error: " + err);
          }
      })
  },
};

export default employeeAPI;