import RoleConstants from '../constants/RoleConstants';
import PermissionConstants from '../constants/PermissionConstants';
import AppDispatcher from '../AppDispatcher';
import RoleStore from '../stores/RoleStore';
import RoleAPI from '../helper/RoleAPI';
const RoleActions = {
	getPermissionJson:function(result){
		console.log("to action get permission json");
		RoleAPI.getPermissionJson((data)=> {
			AppDispatcher.handleAction({
				type: RoleConstants.GET_PERMISSION_JSON,
				permission: data
			});
	}, null, result);
	},
	addRole: function (role, showMsg) {
		RoleAPI.create(role, (data) => {
			AppDispatcher.handleAction({
				type: RoleConstants.ADD_ROLE,
				role: data
			});
		}, null, showMsg);
	},
	getRole: function (getRole) {
		console.log('To action get role');
		RoleAPI.getAll((data)=> {
			AppDispatcher.handleAction({
				type: RoleConstants.GET_ROLE,
				role: data
			});
		}, null, getRole);

	},
	removeRole: function (id, resetCheckbox) {
		console.log("To action remove role");
		RoleAPI.destroy(id, (data) => {
			AppDispatcher.handleAction({
				type: RoleConstants.REMOVE_ROLE,
				role: data
			});
		}, null, resetCheckbox);
	},
	getDataPermissions: function (getDataPermissions) {
		console.log("To action get data permissions");
		RoleAPI.getDataPermissions((data) => {
			AppDispatcher.handleAction({
				type: PermissionConstants.GET_DATA_PERMISSION,
				permissions: data
			});
		}, null, getDataPermissions);
	},
	getDataRoleEdit: function (id,getDataRole) {
		console.log("To action get data Role Edit");
		RoleAPI.getDataRoleEdit(id,(data) => {
			AppDispatcher.handleAction({
				type: RoleConstants.GET_ROLE_EDIT,
				role: data
			});
		}, null, getDataRole)

	},
	editRole:function(role,showMsg)
	{
		console.log("to action edit role");
		console.log(role);
		RoleAPI.updateRole(role,(data)=>{
			AppDispatcher.handleAction({
				type:RoleConstants.EDIT_ROLE,
				data:data
			});
		},null,showMsg);
	}
}
export default RoleActions;