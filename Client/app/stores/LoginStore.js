import {LOGIN_USER, LOGOUT_USER} from '../constants/UserConstants';
import BaseStore from './BaseStore';
import jwt_decode from 'jwt-decode';


class LoginStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this))
    this._user = null;
    this._role=[];
    this._jwt = null;
  }

  _registerToActions(payload) {
    let action = payload.action;
    switch(action.type) {
      case LOGIN_USER:
        this._jwt = action.jwt;
        let _object=jwt_decode(this._jwt);
        this._user = _object.user;
        let _temp = _object.role;
        let _roles = [];
        console.log(_temp);
         _roles.push(_temp.essrole);
         _roles.push(_temp.supervisorrole);
          if(_temp.adminrole){
              _roles.push(_temp.adminrole);
          }
        this._role = _roles;
        console.log('object ', this._role);
        this.emitChange();
        break;
      case LOGOUT_USER:
        this._user = null;
        this.emitChange();
        break;
      default:
        break;
    };
  }

  get user() {
    return this._user;
  }
  get role(){
    return this._role;
  }
  get jwt() {
    return this._jwt;
  }

  isLoggedIn() {
    return !!this._user;
  }
}

export default new LoginStore();