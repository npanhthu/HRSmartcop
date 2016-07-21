import React from 'react';
import RoleActions from '../../actions/RoleActions.js';
import Router from 'react-router';
import RoleStore from '../../stores/RoleStore.js';
import AuthenticatedComponent from '../AuthenticatedComponent';
import Breadcumb from '../Breadcumb';
var Link = Router.Link;
import RouterContainer from '../../helper/RouterContainer';
import Permission,{checkFunction} from '../roles/Permission.js';
import LoginStore from '../../stores/LoginStore.js';
export default AuthenticatedComponent(class AddRoles extends React.Component
{
    constructor()
    {
        super();
        this.state={permissionJson:[],roleType:String,userRole:String,roleEdit:{}};
        this._roles = [];
    }
    handleHide() {
        $('#editUser').hide();
    }
    getPermissionJson()
    {
        return {permissionJson:RoleStore.getPermissionJson()};
    }
    componentWillMount(){
        var _roles = LoginStore.role
        if(checkFunction(_roles,'1','2') == false){
            RouterContainer.get().replaceWith('/error')
        }
    }
    componentDidMount()
    {
        var that=this;
        RoleActions.getDataRoleEdit(this.props.params.role_id,function()
        {
            var role=RoleStore.getRoleEdit();
            that.setState({roleEdit:role});
            RoleActions.getPermissionJson(function()
            {
                that.setState(that.getPermissionJson);
                that.setState({roleType:role.type.roleTypeId});//set default value
                var per=that.state.permissionJson;
                var roleEdit=that.state.roleEdit;
                that.setState({userRole:roleEdit.name});
                $('#userRoleEdit').val(roleEdit.name);
                var a=[];
                for(var i=0;i< per.length ;i++)// Define amount object of file Server/data/permission.json
                {
                   if (per[i].roleTypeId == that.state.roleType)// And Here check roletypeid the same this.state.roletype
                   {
                                for(var m=0;m < roleEdit.permissions.length;m++)// Define amount object available permission of data edit
                                {
                                    for(var n=0;n < roleEdit.permissions[m].rights.length;n++)// Define  amount object available "rights" of data edit
                                    {
                                        console.log("right:"+roleEdit.permissions[m].rights[n].right_id);
                                        for(var j=0;j<per[i].permission.length;j++) // Define  amount object available "permission" of file Server/data/permisson.json
                                        {
                                           a[j]=document.getElementsByName(per[i].permission[j].label);
                                           var name=a[j];
                                           if(per[i].permission[j].permissionId == roleEdit.permissions[m].permission_id) // check condition permission_id the same 
                                           {
                                                for(var k=0;k<name.length;k++)// define  amount checkbox input
                                                {
                                                    if (roleEdit.permissions[m].rights[n].right_id == name[k].value) // check condition right_id the same value checkbox input
                                                    {
                                                        name[k].checked=true;
                                                    }
                                                }
                                           }

                                        }
                                    }
                                }
                   }
               } 
            }); 
        });
        //this.handleHide();
        //var _roles = LoginStore.role
       // if (permission(_roles, '1', '2')) {
         //   $("#editUser").show();
        //}
    }
    handleUserRole(e)
    {
        this._onfocusForm();
        this.setState({userRole: e.target.value});
    }
    handleUserRoleType(e)
    {
        var that=this;
        this._onfocusForm();
        var userRoleType =$('#userRoleType').val();
        this.setState({roleType:userRoleType});
        this.state.permissionJson.map(function(per) {
            if (e.target.value == per.roleTypeId) {
                that.state.nameRoleType = per.name;
            }
        })
    }
    handleEditUserRole(e){
        e.preventDefault();
        var that=this;
        var a=[];
        var per=this.state.permissionJson;
        var permission=[];
        var validateCheck=false;
        for(var i=0;i< per.length ;i++)
        {
           if (per[i].roleTypeId == that.state.roleType)
           {
                for(var j=0;j<per[i].permission.length;j++)
                {
                    a[j]=document.getElementsByName(per[i].permission[j].label);
                    console.log(per[i].permission[j].label);
                    var name=a[j];
                    var permissionChild = {permission_id:"", label:"", rights:[]};
                    for(var k=0;k<name.length;k++)
                    {
                        if(name[k].checked)
                        {
                            validateCheck = true;
                            permissionChild.permission_id = per[i].permission[j].permissionId;
                            permissionChild.label=per[i].permission[j].label;
                            permissionChild.rights.push({name:name[k].id,right_id:name[k].value });
                        }
                    }
                    if(permissionChild.permission_id != "")
                    {
                        permission.push(permissionChild);
                    }
                }
           }
        }
        if(validateCheck == false || this.state.userRole == "")
        {
            if(this.state.userRole == "")
            {
                $('#errorUserRole').html("Please Input UserRole");
            }
            if(validateCheck == false)
            {
                $('#errorCheckbox').html('Please choose a checkbox');
            }
        }
        else
        {
            var roles = {_id:this.props.params.role_id,userRole:that.state.userRole, userRoleType:that.state.roleType,Permission:permission};
            RoleActions.editRole(roles,function(){
                var dataResponse=RoleStore.getMessageEdit();
                if(dataResponse.message)
                {
                    $('#errorExistUser').html(dataResponse.message);
                    RouterContainer.get().transitionTo('/role');
                }
            });
        }
    }
    _onfocusForm()
    {
        $('#errorExistUser').html('');
        $('#successAddRole').html('');
        $('#errorUserRole').html('');
        $('#errorCheckbox').html('');
    }
    render() {
        var roleEdit=this.state.roleEdit;
        var roleName=roleEdit.name;
        console.log(name);
        var roleType=this.state.permissionJson.map(function(per){
            if (roleEdit.type.roleTypeId == per.roleTypeId) 
            {
                return (<option selected value ={per.roleTypeId}>{per.name}</option>);
            }
            });
            var that=this;
         var permission=this.state.permissionJson.map(function(per){
                 if(per.roleTypeId == that.state.roleType)
                 {
             return (<div><table style={{border:'none'}}><tbody><tr><td>{per.permission.label}</td></tr>
                        {per.permission.map(function(a){
                            return (
                                <tr>
                                <td>{a.label}</td>  
                                {a.rights.map(function(right){
                                   return(<td>                                                                                                   
                                  <div style={{marginLeft:'30px'}} className="checkbox">                                                                             
                                      <label><input type="checkbox" name = {a.label} id={right.name} value={right.right_id} />{right.name}</label>            
                                  </div>                                                                                             
                              </td>) 
                                })}  </tr> );
                        })}</tbody></table>
                     </div>
                      );
                 }}
);
            return (<div>
                <div className="container-fluid">
                    <div className="rows">
                        <Breadcumb dataUri={[{'link':'home','name':'Home'},{'link':'role','name':'User Role Management'}]} activeName={roleEdit.name} />
                    </div>
                    <div className="rows">
                        <div className="name-page">Edit User Role</div>
                        <div className="panel">
                            <div className="panel-body">
                                <form>
                                    <p className="successForm" id="successAddRole"></p>
                                    <p className="errorValidation" id="errorExistUser"></p>
                                    <div className="row">
                                        <div className="form-group col-sm-3">
                                            <label for="exampleInputEmail1">User Role</label>
                                            <input type="text" id = "userRoleEdit" onChange={this.handleUserRole.bind(this)} className="form-control" placeholder="Enter User Role" />
                                            <span className="errorValidation" id="errorUserRole"></span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-sm-3">
                                            <label for="exampleInputEmail1">User Role Type</label>
                                            <select disabled id="userRoleType" className="form-control" onChange = {this.handleUserRoleType.bind(this)}>
                                                {roleType}
                                                <span className="errorValidation" id="errorUserRoleType"></span>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-sm-6">
                                            <label for="exampleInputEmail1">Permission Access</label> 
                                                {permission}
                                            <span className="errorValidation" id="errorCheckbox"></span>

                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-sm-3">
                                            <button className="btn sc-btn-green" id = "editUser" onClick={this.handleEditUserRole.bind(this)} type="submit">Save</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});