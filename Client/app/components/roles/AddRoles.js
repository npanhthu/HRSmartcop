import React from 'react';
import RoleActions from '../../actions/RoleActions.js';
import Router from 'react-router';
import RoleStore from '../../stores/RoleStore.js';
import AuthenticatedComponent from '../AuthenticatedComponent';
import Permission,{checkFunction} from '../roles/Permission.js';
import RouterContainer from '../../helper/RouterContainer';
import LoginStore from '../../stores/LoginStore.js';
import Breadcumb from '../Breadcumb';
var Link = Router.Link;
export default AuthenticatedComponent(class AddRoles extends React.Component
{
    constructor()
    {
        super();
        this.state={permissionJson:[],roleType:String,userRole:String,nameRoleType:String};
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
        this.state.userRole="";
        RoleActions.getPermissionJson(function()
        {
            that.setState(that.getPermissionJson);
            var permission=that.state.permissionJson;
            that.setState({roleType:permission[0].roleTypeId});//set default value 
            that.setState({nameRoleType:permission[0].name});// set default value
        });
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
    removeChecked()
    {
        var that=this;
        var per=this.state.permissionJson;
        var a=[];
        for(var i=0;i< per.length ;i++)// Define amount object of file Server/data/permission.json
        {
           if (per[i].roleTypeId == that.state.roleType)// And Here check roletypeid the same this.state.roletype
           {
                for(var j=0;j<per[i].permission.length;j++)// run a loop to define amount "permission" variable of file Server/data/permission.json
                {
                    a[j]=document.getElementsByName(per[i].permission[j].label);
                    var name=a[j];
                    for(var k=0;k<name.length;k++)
                    {
                        if(name[k].checked)
                        {
                          name[k].checked=false;  
                        }
                    }
                }
           }
       }
    }
    handleAddUserRole(e){
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
                    var permissionChild = {permission_id:"", label:"",rights:[]};
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
            var roles = {userRole:that.state.userRole, userRoleType:that.state.roleType,nameRoleType:that.state.nameRoleType,Permission:permission};
            RoleActions.addRole(roles,function(){
                var dataResponse=RoleStore.getExistRole();
                if(dataResponse.success)
                {
                    $('#successAddRole').html(dataResponse.success);
                    $('#errorExistUser').html('');
                    $('#userRole').val('');
                    that.setState({userRole:""});
                    $('#errorCheckbox').html('');
                    that.removeChecked();
                }
                if(dataResponse.message)
                {
                    $('#errorExistUser').html(dataResponse.message);
                    $('#successAddRole').html('');
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
        var roleType=this.state.permissionJson.map(function(per){
            return (<option value ={per.roleTypeId}>{per.name}</option>);});
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
                                      <label><input type="checkbox" id={right.name} name = {a.label} value={right.right_id} />{right.name}</label>            
                                  </div>                                                                                             
                              </td>) 
                                })} 
                                 </tr> );
                        })}</tbody></table>
                     </div>
                      );
                 }}
);
            return (<div>
                <div className="container-fluid">
                    <div className="rows">
                        <Breadcumb dataUri={[{'link':'home','name':'Home'},{'link':'role','name':'User Role Management'}]} activeName="Add Role" />
                    </div>
                    <div className="rows">
                        <div className="name-page">Add User Role</div>
                        <div className="panel">
                            <div className="panel-body">
                                <form>
                                    <p className="successForm" id="successAddRole"></p>
                                    <p className="errorValidation" id="errorExistUser"></p>
                                    <div className="row">
                                        <div className="form-group col-sm-3">
                                            <label for="exampleInputEmail1">User Role</label>
                                            <input type="text" id = "userRole" onChange={this.handleUserRole.bind(this)} className="form-control" value={this.state.userRole} placeholder="Enter User Role" />
                                            <span className="errorValidation" id="errorUserRole"></span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-sm-3">
                                            <label for="exampleInputEmail1">User Role Type</label>
                                            <select id="userRoleType" className="form-control" onChange = {this.handleUserRoleType.bind(this)}>
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
                                            <button className="btn sc-btn-green" onClick={this.handleAddUserRole.bind(this)} type="submit">Save</button>
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