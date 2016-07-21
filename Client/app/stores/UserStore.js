import AppDispatcher from '../AppDispatcher.js';
import UserConstants from '../constants/UserConstants.js';
import BaseStore from './BaseStore';
class UserStore extends BaseStore {
  constructor() {
    super();
    this.state = {users: [],userEdit:[],data:{},_userExist:'',identify:'',msg:'', userName:''};
    this.subscribe(() => this._registerToActions.bind(this))
  }
  get users() {
    return this.state.users;
  }
  getUserName(){
      return this.state.userName;
  }
  getEdit() {
  return this.state.userEdit;
}
  getState() {
    return this.state.data;
  }
  getId(){
      return this.state.identify;
  }
  getExistUser() {
    return this.state._userExist;
  }
  forgetPass(){
    return this.state.msg;
  }

  _registerToActions(payload) {
    let action = payload.action;
    switch (action.type) {
      case UserConstants.ADD_USER:{
        console.log("to store add user");
        this.state.data = action.user;
        this.emitChange();
        break;
        }
      case UserConstants.ADD_USER_SUCCESS:{
        console.log("to store add user success");
        this.state._userExist = action.data;
        this.emitChange();
        break;
        }
      case UserConstants.ADD_USER_FAIL:{
        console.log("to store add user fail");
        this.emitChange();
        break;
        }
      case UserConstants.DISABLE_USER:{
        console.log('to store disable user');
        this.emitChange();
        break;
        }
      case UserConstants.GET_USERS:{
        this.state.users = action.users;
        console.log(action.users);
        break;
        }
      case UserConstants.REMOVE_USER:{
        this.emitChange();
        break;
        }
      case UserConstants.GET_USER_ID:{
        this.emitChange();
        console.log(action.userData);
        this.state.userEdit=action.userData;
        break;
      }
      case UserConstants.EDIT_USER:{
        this.state._userExist = action.data;
          console.log("data in store " + this.state._userExist)
        this.emitChange();
        break;
      }
      case UserConstants.GET_A_USER:
      {
        this.state.data = action.data;
        console.log("store");
        console.log(this.state.data);
        if (!this.state.data.userrole.adminrole)
          this.state.identify = this.state.data.employeeId;
        break;
      }
      case UserConstants.SEND_MAIL:{
        console.log('store send msg');
        this.state.msg = action.data;
        console.log('data: '+this.state.msg.success);
        break;
      }
      case UserConstants.CHECK_TOKEN:{
        console.log('store check token');
        this.state.msg = action.data;
        console.log('data: '+this.state.msg.message);
        break;
      }
      case UserConstants.CHANGE_PASS:{
        console.log('store change pass');
        this.state.msg = action.data;
        console.log('data: '+this.state.msg.success);
        break;
      }
      case UserConstants.GET_USER_NAME:{
          this.state.userName = action.data;
          console.log("UserName " + this.state.userName);
          break;
      }
      default:
        break;
    }
  }
}
export default new UserStore();