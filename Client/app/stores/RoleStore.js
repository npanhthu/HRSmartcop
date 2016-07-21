import AppDispatcher from '../AppDispatcher.js';
import RoleConstants from '../constants/RoleConstants.js';
import PermissionConstants from '../constants/PermissionConstants.js';
import BaseStore from './BaseStore';
class RoleStore extends BaseStore {
    constructor() {
        super();
        this.state = {_roles: [],_roleExist:'',_permissions:[],_roleEdit:[],_messageEdit:[],_permissionJson:[]};
        this.subscribe(() => this._registerToActions.bind(this))
    }
    getRoles()
    {
        return this.state._roles;
    }
    setExistRole(data)
    {
        this.state._roleExist=data;
    }
    getExistRole()
    {
        return this.state._roleExist;
    }
    getPermissions()
    {
        return this.state._permissions;
    }
    getRoleEdit()
    {
        return this.state._roleEdit;
    }
    getMessageEdit()
    {
        return this.state._messageEdit;
    }
    getPermissionJson()
    {
        return this.state._permissionJson;
    }
    _registerToActions(payload) {
        let action = payload.action;
        switch (action.type) {
            case RoleConstants.ADD_ROLE:{
                var data = action.role;
                this.setExistRole(data);
                break;
            }
            case RoleConstants.GET_ROLE:{
                var data = action.role;
                console.log("to store get role");
                this.state._roles = data;
                break;
            }
            case RoleConstants.REMOVE_ROLE:{
                this.emitChange();
                break;
            }
            case PermissionConstants.GET_DATA_PERMISSION:{
                var data=action.permissions;
                console.log(" to store get data permission");
                this.state._permissions=data;
                break;
            }
            case RoleConstants.GET_ROLE_EDIT:
            {
                var data=action.role;
                this.state._roleEdit=data;
            }
            case RoleConstants.EDIT_ROLE:
            {
                var data=action.data;
                this.state._messageEdit=data;
            }
            case RoleConstants.GET_PERMISSION_JSON:
            {
                var data=action.permission;
                this.state._permissionJson=data;
            }
        }
    }
}
export default new RoleStore();