import LeaveConstant from '../constants/LeaveConstants.js';
import LeaveAPI from '../helper/LeaveAPI.js';
import LeaveDispatcher from '../AppDispatcher.js';
import LeaveStore from '../stores/LeaveStore.js';

export default {
  addLeaveType: (LeaveType, getMsg) => {
    console.log( LeaveType );
    LeaveAPI.saveLeave( LeaveType, getMsg, (data) => {
      LeaveDispatcher.handleAction( {
        type: LeaveConstant.ADD_LEAVE_TYPE,
        data: data
    } )
  }, getMsg )
},
getALeaveType: (id, getMsg) => {
    LeaveAPI.get( id, (data) => {
      LeaveDispatcher.handleAction( {
        type: LeaveConstant.GET_DATA_TO_EDIT,
        data: data
    } )
  }, getMsg )
},
updateLeaveType: (data, getMsg) => {
    LeaveAPI.updateLeaveType( data, (result) => {
      LeaveDispatcher.handleAction( {
        type: LeaveConstant.UPDATE_EMPLOYEE_TYPE,
        data: result
    } )
  }, getMsg )
},
getAll: (getLeaveType) => {
    LeaveAPI.getAll( (data) => {
      LeaveDispatcher.handleAction( {
        type: LeaveConstant.GET_ALL_LEAVE_TYPE,
        leaveType: data
    } )
  }, null, getLeaveType )
},
removeLeaveType: (id, resetCheckbox) => {
    LeaveAPI.destroy( id, (data) => {
      LeaveDispatcher.handleAction( {
        type: LeaveConstant.REMOVE_TYPE_LEAVE,
        leaveType: data
    } );
  }, null, resetCheckbox );
},
  //work week
  getWorkWeek: (workCountry, getData) => {
    LeaveAPI.getWorkWeek( workCountry, getData );
},
updateWork: (workWeek, showMsg) => {
    LeaveAPI.updateWork( workWeek, showMsg );
},
  //Period
  addLeavePeriod: (data, getMsg) => {
    LeaveAPI.updateLeavePeriod( data, (result) => {
      LeaveDispatcher.handleAction( {
        type: LeaveConstant.UPDATE_LEAVE_PERIOD,
        data: result
    } )
  }, getMsg )
},
getAllDataLeavePeriod: (success) => {
    LeaveAPI.getLeavePeriod( (getData) =>{
      LeaveDispatcher.handleAction({
        type:LeaveConstant.GET_PERIODS,
        data:getData
      })
    } ,success);
},
getLeavePeriod: (success) => {
    LeaveAPI.getAllDataLeavePeriod( (result) => {
      LeaveDispatcher.handleAction( {
        type: LeaveConstant.GET_ALL_PERIOD,
        data: result
    } )
  }, success )
},
assignLeaveType1: (object, showMsg, getMs) => {
    LeaveAPI.assignLeaveType1( object, (data) => {
      LeaveDispatcher.handleAction( {
        type: LeaveConstant.ASSIGN_LEAVE,
        data: data
    } );
  }, showMsg, getMs )
},
  //entitlement
  addLeaveEntitlement: (data, getMsg) => {
    console.log( data );
    LeaveAPI.addLeaveEntitlement( data, (dataServer) => {
      LeaveDispatcher.handleAction( {
        type: LeaveConstant.ADD_LEAVE_ENTITLEMENT,
        data: dataServer
    } );
  }, getMsg )
},
getAllEntitle: (name, getEntitle) => {
    console.log( 'action of entitle' )
    LeaveAPI.getAllEntitle( name, (data) => {
      LeaveDispatcher.handleAction( {
        type: LeaveConstant.GET_ALL_ENTITLE,
        data: data
    } )
  }, null, getEntitle )
},
getEntitle: (id, name, getEntitle) => {
    console.log( "To action get data Role Edit" );
    LeaveAPI.getEntitle( id, name, (data) => {
      LeaveDispatcher.handleAction( {
        type: LeaveConstant.GET_ENTITLE,
        data: data
    } );
  }, null, getEntitle )
},
removeLeaveEntitle: (id, resetCheckbox) => {
    LeaveAPI.deleteEntitle( id, (data) => {
      LeaveDispatcher.handleAction( {
        type: LeaveConstant.REMOVE_LEAVE_ENTITLE,
        data: data
    } );
  }, null, resetCheckbox );
},
getLeaveType: (employeeId,getData)=>{
    console.log("den action goi");
    LeaveAPI.getLeaveType(employeeId, (data)=>{
        LeaveDispatcher.handleAction({
            type:LeaveConstant.GET_LEAVE_TYPE,
            data:data
        });
    },getData);
},
getLeaveTypeByEmployee: (employeeId,getMs,showData)=>{
  LeaveAPI.getLeaveTypeEm(employeeId, (data)=>{
    LeaveDispatcher.handleAction({
      type:LeaveConstant.GET_LEAVE_EM,
      data:data
    });
  },getMs,showData);
},
getListAssign: (getData) => {
    LeaveAPI.getListAssign( (data) => {
      LeaveDispatcher.handleAction( {
        type: LeaveConstant.GET_LIST_ASSIGN,
        data: data
    } )
  },getData )
},

upDateAssign:(data)=>{
    LeaveAPI.upDateAssign(data,() => {
      LeaveDispatcher.handleAction( {
        type: LeaveConstant.ACTION_LEAVE,
        data: ''
    } )
  })
  },
schedulerAssign: (_data, getMsg, showMsg)=>{
        LeaveAPI.addAssign(_data, (msg) => {
            LeaveDispatcher.handleAction({
                type:LeaveConstant.SCHEDULER_ASSIGN,
                data: msg
            });
        },getMsg, showMsg)
    },
    deleteAssign: (ID, getMsg, showMsg)=>{
        LeaveAPI.deleteAssign(ID, (msg)=>{
            LeaveDispatcher.handleAction({
                type:LeaveConstant.DELETE_CALENDAR_ASSIGN,
                data: msg
            });
        },getMsg, showMsg)
    },
  getListAssignUser: (employeeID,getData)=>{
        console.log("den action goi");
        LeaveAPI.getListAssignUser(employeeID, (data)=>{
            LeaveDispatcher.handleAction({
                type: LeaveConstant.GET_LIST_ASSIGN_USER,
                data:data
            });
        },getData);
    },
    checkEntitle: function (entitlement, showMsg) {
        LeaveAPI.checkEntitle(entitlement, (data) => {
            LeaveDispatcher.handleAction({
                type: LeaveConstant.CHECK_ENTITLE,
                data: data
            });
        }, showMsg);
    },
    checkLeaveType: function (entitlement, showMsg) {
        LeaveAPI.checkLeaveType(entitlement, (data) => {
            LeaveDispatcher.handleAction({
                type: LeaveConstant.CHECK_ENTITLE_LEAVE,
                data: data
            });
        }, showMsg);
    },
    saveNumberOfDay: (data)=>{
    LeaveAPI.saveNumberOfDay(data)
  },
    getEntitleById: (id, getEntitle) => {
        console.log( 'action of entitle' )
        LeaveAPI.getEntitleById( id, (data) => {
            LeaveDispatcher.handleAction( {
                type: LeaveConstant.GET_ENTITLE_BY_ID,
                data: data
            } )
        }, null, getEntitle )
    }
}
