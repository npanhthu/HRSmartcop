import $ from 'jquery';
import Constants from '../constants/LeaveConstants.js';
const hostName=window.location.hostname;
const BASE_URL = 'http://'+hostName+':3007/apiLeave/leaveType/';
const PERIOD_URL = 'http://'+hostName+':3007/api/leave/configure/leaveperiod';
const BASE_URL_ENTITLE = 'http://'+hostName+':3007/api/leave/leaveEntitlement';
const MAIL_URL='http://'+hostName+':3007/api/mail/';
const _URL_LEAVE_LIST = 'http://' + hostName + ':3007/api/leave/leaveList';
const _URL_SCHEDULER_LEAVE = 'http://' + hostName + ':3007/api/leave/schedulerLeave';
const _URL_LEAVE_TYPE = 'http://' + hostName + ':3007/api/leave/configure/leaveType/';
const _URL_WORK_WEEK = 'http://' + hostName + ':3007/api/leave/configure/workWeek/'
$.ajaxSetup({
  xhrFields: {
      withCredentials: false
   }
});
const leaveAPI = {
    saveLeave : (LeaveObject,success,getMsg)=>{
        $.ajax({
            url:_URL_LEAVE_TYPE,
            type: 'POST',
            dataType: 'json',
            data:LeaveObject,
            success:(data)=>{
                success(data);
                getMsg(data);
            },
            error:(err)=>{
                console.log(err);
            }
        });
    },

    get : (id,success,getMsg)=>{
        $.ajax({
            url:_URL_LEAVE_TYPE +'findByIdentify/'+ id,
            type : 'GET',
            dataType:'json',
            success:(data)=>{
                success(data);
                getMsg(data);
            },
            error:(err)=>{
                console.log(err);
            }
        })
    },

    updateLeaveType : (data,success,getMsg)=>{
        $.ajax({
            url:_URL_LEAVE_TYPE ,
            type: 'PUT',
            dataType : 'json',
            data:data,
            success:(result)=>{
                console.log(result);
                success(result);
                getMsg();
            },
            error:(err)=>{
                console.log(err)
            }
        })
    },
    getAll: (success, failure,getLeaveType)=> {
        $.ajax({
            url:_URL_LEAVE_TYPE,
            type: 'GET',
            dataType: 'json',
            success: (data)=> {
                success(data);
                getLeaveType();
            },
            error: (xhr, status, error)=> {
                failure(error);
            }
        });
    },
    destroy: (id, success, failure,resetCheckbox)=> {
        $.ajax({
            url: _URL_LEAVE_TYPE + id,
            type: 'DELETE',
            dataType: 'json',
            success: (data)=> {
                success(data);
                resetCheckbox();
            },
            error: (xhr, status, error)=> {
                console.log(error);
            }
        });
    },

    //Work Week
    updateWork: (leaveWorkWeek,showMsg) => {
        $.ajax({
            url: _URL_WORK_WEEK ,
            type: 'POST',
            dataType: 'json',
            data: leaveWorkWeek,
            success: (data)=>
            {
                showMsg(data);
            },
            error: (data) =>{
                showMsg(data);
            }
        });
    },
    getWorkWeek: (country,getData)=>{
        $.ajax({
            url : _URL_WORK_WEEK +country,
            type:'GET',
            success: (data)=>{
                getData(data)
            }

        });
    },
    updateLeavePeriod : (data,success,getMsg)=>{
      $.ajax({
        url:PERIOD_URL,
        type: 'PUT',
        dataType : 'json',
        data:data,
        success:(result)=>{
          success(result);
          getMsg(result);
        },
        error:(err)=>{
          console.log(err)
        }
      })
    },
    getLeavePeriod: (getData,success)=>{
      $.ajax({
        url: PERIOD_URL,
        type:'GET',
        success: (data)=>{
          getData(data)
          success();
          console.log(data);
        }
      })
    },
    assignLeaveType1 : (object,success,getMs)=>{
      $.ajax({
        url:BASE_URL + 'assign/',
        type: 'POST',
        dataType: 'json',
        data:object,
        success:(data)=>{
          success(data);
          getMs();
        },
        error:(err)=>{
        }
      });
    },
    getAllDataLeavePeriod: (success,getLeavePeriod)=>{
      $.ajax({
        url:PERIOD_URL+'/getPeriodCurrentYear',
        type: 'GET',
        dataType: 'json',
        success: (data)=> {
          success(data);
          getLeavePeriod(data);
        }
      });
    },
    // entitlement
    addLeaveEntitlement: (object,success,getMsg)=>{
      $.ajax({
        url:BASE_URL_ENTITLE,
        type: 'POST',
        dataType: 'json',
        data:object,
        success:(data)=>{
          console.log(data);
          success(data);
          getMsg(data);
        },
        error:(err)=>{
        }
      });
    },
    //add entitlement levave
    getLeaveTypeEm:(employeeId, success,showData)=>{
        $.ajax({
            url:BASE_URL_ENTITLE +'/findLeaveTypeByEmployee/'+employeeId,
            type:'PUT',
            dataType:'json',
            success: (data)=>{
                success(data);
                showData();
            },
            error:(err)=>{
                console.log(err);
            }
        });
    },



    getAllEntitle: (name,success, failure,getEntitle)=> {
      console.log('to API of entitles get all');
      $.ajax({
        url:BASE_URL_ENTITLE+'/findByEmployeeID/' +name,
        type: 'GET',
        dataType: 'json',
        success: (data)=> {
          success(data);
          getEntitle();
        },
        error: (xhr, status, error)=> {
          failure(error);
        }
      });
    },
  getEntitle:(id,name,success,failure,getEntitle)=>
  {
    console.log('to API get data leave type');
    $.ajax({
      url: BASE_URL_ENTITLE +'/id/'+id+'/'+name,
      type: 'GET',
      dataType: 'json',
      success: (data)=> {
        success(data);
        getEntitle();
      },
      error: (xhr, status, error)=> {
        failure(error);
      }
    });
  },
    deleteEntitle: (id, success, failure,resetCheckbox)=> {
      $.ajax({
        url: BASE_URL_ENTITLE +'/'+ id,
        type: 'DELETE',
        dataType: 'json',
        success: (data)=> {
          success(data);
          resetCheckbox();
        },
        error: (xhr, status, error)=> {
          failure(error);
        }
      });
    },
    getLeaveType: (employeeId,success,getData)=>{
      console.log("den api goi");
      $.ajax({
        url: BASE_URL_ENTITLE + '/findLeaveEntitleByEmployeeId/' + employeeId,
        type: 'GET',
        dataType: 'json',
        success: (data)=>{
          success(data);
          getData();
        },
        error: (err)=>{
          console.log(err);
        }
      })
    },
    upDateAssign: (_data,success)=>{
        console.log('test send mail of leave list')
      $.ajax({
        url: MAIL_URL+'approve-assign',
        type:'POST',
        dataType:'json',
        data:_data,
        success: (msg)=>{
          success()
        },
        error:(xhr,status,error)=>{
          console.log(error)
        }
      })
    },
    addAssign: (data, success,showMsg)=>{
        console.log("data  " ,data);
        if(data._identify){
            $.ajax({
                url:_URL_SCHEDULER_LEAVE ,
                type: 'PUT',
                dataType: 'json',
                data:data,
                success:(msg)=>{
                    success(msg);
                    showMsg();
                },
                error:(err)=>{
                    console.log(err)
                }
            })
        }else{
            $.ajax({
                url:_URL_SCHEDULER_LEAVE ,
                type: 'POST',
                dataType: 'json',
                data:data,
                success:(msg)=>{
                    success(msg);
                    showMsg();
                },
                error:(err)=>{
                    console.log(err)
                }
            })
        }

    },
    deleteAssign:(ID,success,showMsg)=>{
        $.ajax({
            url:_URL_SCHEDULER_LEAVE  +'/'+ ID,
            type:"DELETE",
            dataType:'json',
            success:(msg)=>{
                success(msg);
                showMsg();
            },
            error:(err)=>{
                console.log(err);
            }
        })
    },
    getListAssign: (success,getData)=>{
        console.log("den api");
        $.ajax({
            url: _URL_SCHEDULER_LEAVE ,
            type:'GET',
            dataType:'json',
            success: (data)=>{
                console.log(data);
                success(data);
                getData();
            },
            error: (error)=>{
                console.log(error)
            }
        });
    },
    getListAssignUser:(employeeID,success,getData)=>{
        console.log("den api goi");
        $.ajax({
            url: _URL_SCHEDULER_LEAVE + '/findByEmployeeId/' + employeeID,
            type:'GET',
            dataType:'json',
            success:(data)=>{
                success(data);
                getData();
            },
            error:(err)=>{
                console.log(err)
            }
        })
    },
    checkEntitle:(entitlement,success,showMsg)=>{
        $.ajax({
            url: BASE_URL_ENTITLE  + '/findByEmployeeIdAndLeaveTypeIdAndLeavePeriodId',
            type:'POST',
            dataType:'json',
            data:entitlement,
            success:(data)=>{
                success(data);
                showMsg();
            },
            error:(err)=>{
                console.log(err)
            }
        })
    },
    checkLeaveType:(entitlement,success,showMsg)=>{
        $.ajax({
            url: BASE_URL_ENTITLE  + '/findByEmployeeIdAndLeaveTypeId',
            type:'POST',
            dataType:'json',
            data:entitlement,
            success:(data)=>{
                success(data);
                showMsg();
            },
            error:(err)=>{
                console.log(err)
            }
        })
    },
    //Leave List
    saveNumberOfDay:(_data)=>{
    let objData={
      arrData:_data
    }
    $.ajax({
      url: _URL_LEAVE_LIST +'/number-of-day',
      type: 'POST',
      dataType: 'json',
      data: objData,
      success: (msg)=>{
      },
       error:(err)=>{
      }
    })
  },
    getEntitleById: (id,success, failure,getEntitle)=> {
        console.log('to API get entitle from id');
        $.ajax({
            url:BASE_URL_ENTITLE+'/findById/' +id,
            type: 'GET',
            dataType: 'json',
            success: (data)=> {
                success(data);
                getEntitle();
            },
            error: (xhr, status, error)=> {
                failure(error);
            }
        });
    }
  }

export default leaveAPI;
