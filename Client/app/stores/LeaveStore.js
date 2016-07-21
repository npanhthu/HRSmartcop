import AppDispatcher from '../AppDispatcher.js';
import LeaveConstants from '../constants/LeaveConstants.js';
import BaseStore from './BaseStore';

class LeaveStore extends BaseStore {

    constructor() {
        super();
        this.state = {message:"", msg:'',LeaveType:{},mesUpdate:"", _leavetype : [], _listLeaveType:[],_assignLeave:[],entitle:[],period:[],getPeriod:[]}
        this.subscribe(() => this._registerToActions.bind(this))
    }
    getMsg(){
        return this.state.msg
    }
    get getMessage(){
        return this.state.message;
    }

    get getMessageUpdate(){
        return this.state.mesUpdate;
    }

    getLeaveType(){
        return this.state._leavetype;
    }

    get assignList(){
        return this.state._assignLeave;
    }

    get getALeaveType(){
        return this.state.LeaveType;
    }
    getMessageAddLeaveEntitlement()
    {
        return this.state.messageLeaveEntitlement;
    }
    //get leave type by employee
    getLeaveTypeEm()
    {
        return this.state._listLeaveType;
    }
    getEntitle(){
        return this.state.entitle;
    }
    getPeriod()
    {
        return this.state.period;
    }
    getAllPeriod()
    {
        return this.state.getPeriod;
    }
    _registerToActions(payload) {
        let action = payload.action;
        switch (action.type) {
            case LeaveConstants.ADD_LEAVE_TYPE:
                this.state.message = action.data;
                this.emitChange();
                break;
            case LeaveConstants.GET_DATA_TO_EDIT:
                this.state.LeaveType = action.data;
                break;
            case LeaveConstants.UPDATE_EMPLOYEE_TYPE:
                this.state.mesUpdate = action.data.message;
                console.log("message "+ this.state.mesUpdate);
                break;
            case LeaveConstants.GET_ALL_LEAVE_TYPE:
                var data = action.leaveType;
                this.state._leavetype = data;
                break;
            case LeaveConstants.REMOVE_TYPE_LEAVE:
                this.emitChange();
                break;
            case LeaveConstants.ASSIGN_LEAVE:
                var assignList = action.data;
                this.state._assignLeave = assignList.data;
                this.state.message = assignList.message;
                break;
            case LeaveConstants.ADD_LEAVE_ENTITLEMENT:
                var data=action.data;
                this.state.messageLeaveEntitlement=data;
                break;
            case LeaveConstants.GET_ALL_ENTITLE:
                var data = action.data;
                this.state.entitle = data;
                break;
            case LeaveConstants.GET_ENTITLE:
                this.state.entitle = action.data;
                break;
            case LeaveConstants.GET_ALL_PERIOD:
                this.state.period=action.data;
                break;
            case LeaveConstants.REMOVE_LEAVE_ENTITLE:
                this.emitChange();
                break;
            case LeaveConstants.GET_LEAVE_TYPE:
                this.state._leavetype = action.data;
                break;
            case LeaveConstants.GET_LIST_ASSIGN:
                    this.state._assignLeave=action.data;
                break;
            case LeaveConstants.ACTION_LEAVE:
                    this.emitChange();
                break;
            case LeaveConstants.GET_LIST_ASSIGN_USER:
                console.log("den store user assign ");
                console.log(action.data);
                this.state._assignLeave=action.data;
                break;
            case LeaveConstants.SCHEDULER_ASSIGN:
                this.state.message = action.data;
                break;
            case LeaveConstants.DELETE_CALENDAR_ASSIGN:
                console.log("den store scheduler");
                this.state.message = action.data;
                break;
            case LeaveConstants.CHECK_ENTITLE :
                console.log('to store get message entitle')
                this.state.msg = action.data;
                console.log('data'+action.data.message)
                break;
            case LeaveConstants.CHECK_ENTITLE_LEAVE :
                console.log('to store get message entitle')
                this.state.msg = action.data;
                console.log('data'+action.data.message)
                break;
            case LeaveConstants.GET_PERIODS:
                console.log("to store get all period");
                this.state.getPeriod=action.data;
                break;
            case LeaveConstants.GET_LEAVE_EM:
                this.state._listLeaveType=action.data.data;
                break;
            case LeaveConstants.GET_ENTITLE_BY_ID:
                this.state.entitle = action.data
                break;
        }
    }
}

export default new LeaveStore();
