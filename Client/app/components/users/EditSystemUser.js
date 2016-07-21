import React from 'react';
import UserActions from '../../actions/UserActions';
import UserStore from '../../stores/UserStore';
import RoleActions from '../../actions/RoleActions.js'
import RoleStore from '../../stores/RoleStore.js'
import Router from 'react-router';
import AuthenticatedComponent from '../AuthenticatedComponent';
import EmployeeAction from '../../actions/EmployeeActions';
import EmployeeStore from '../../stores/EmployeeStore';
import Select from 'react-select';
import RouterContainer from '../../helper/RouterContainer';
import Breadcumb from '../Breadcumb';
import Permission,{checkFunction,checkHeader} from '../roles/Permission.js';
import LoginStore from '../../stores/LoginStore.js';
var Link = Router.Link;
export default AuthenticatedComponent(
class SaveSystemUser extends React.Component {
    constructor() {
        super();
        this.state = {listEmployees: [], role: [], employeeId: "",userEdit:{}}
        this._roles = [];
    }

    getEmployees() {
        return {listEmployees: EmployeeStore.getEmployeeList()};
    }

    getRoles() {
        return {role: RoleStore.getRoles()}
    }

    handleHide() {
        $('#editUser').hide();
    }

    componentWillMount() {
        var that = this
        EmployeeAction.getEmployee(function () {
            that.setState(that.getEmployees())
            that.getData();
        })
        RoleActions.getRole(function () {
            that.setState(that.getRoles())
        })
        this._roles = LoginStore.role
        if (!checkHeader(this._roles, '0')) {
            RouterContainer.get().replaceWith('/error')
        }
    }

    componentDidMount() {
        this.handleHide();
        this._roles = LoginStore.role
        console.log("roles ", this._roles);
        if (checkFunction(this._roles, '0', '2')) {
            $("#editUser").show();
        }
    }

    getData() {
        var that = this;
        UserActions.getUserId(this.props.params.user, function () {
            var getUserFromStore = UserStore.getEdit();
            that.setState({userEdit:getUserFromStore});
            $('#RolesEss').val(getUserFromStore.userrole.essrole);
            $('#RolesSuper').val(getUserFromStore.userrole.supervisorrole);
            $('#email').val(getUserFromStore.email);
            if (getUserFromStore.userrole.adminrole == "") {
                $('#RolesAdmin').val('Select');
            }
            else {
                $('#RolesAdmin').val(getUserFromStore.userrole.adminrole);
            }
            $('#userName').val(getUserFromStore.username);
            if(getUserFromStore.username.search('@smartdev.vn')!=-1){
                $("#password").prop('disabled', true);
                $("#confirmPassword").prop('disabled', true);
                $("#email").prop('disabled', true);
                $('#userName').prop('disabled', true);
                $('#select-employee').prop('disabled',true);
            }
            else{
                $('#password').val(getUserFromStore.password);
                $('#confirmPassword').val(getUserFromStore.password);
            }
            $('#employeeName').val(getUserFromStore.employeeId);
            $('#status').val(getUserFromStore.status);
            var userNamePost = getUserFromStore.username;
            that.setState({userNamePost: userNamePost});
            that.setState({employeeId: getUserFromStore.employeeId});
        });
    }

    handleUserNameChange(e) {
        this.state.username = e.target.value;
        this.onFocusValidation();
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }
    handleEmailChange( e )
    {
        this.state.email= e.target.value;
        this.onFocusValidation();
    }
    handleEmployee(val) {
        this.state.employeeId = val;
    }
    handleStatusChange(e)
    {
        this.state.status= e.target.value;
        this.onFocusValidation();
    }
    validateEmail(email) {
        var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return regex.test(email);
    }
    handleClickSubmit(e) {
        e.preventDefault();
        var username = $('#userName').val();
        var password = $('#password').val();
        var confirmPassword = $('#confirmPassword').val();
        var adminRole = $('#RolesAdmin option:selected').val()
        var lengthUserName = username.length;
        var lengthPassword = password.length;
        var employeeId = $('#employeeName').val();
        var status = $('#status').val();
        var email = $('#email').val();
        var that = this;
        if (adminRole == "Select") {
            adminRole = "";
        }
         var userEdit=this.state.userEdit; 
         if(userEdit.accType != 1)
           {
            if (employeeId == 0 || lengthUserName < 6 || lengthUserName > 20 || lengthPassword < 6 || lengthPassword > 20 || password != confirmPassword || employeeId == "" || status == "" ||email =="") 
            {

            if (lengthUserName < 6 || lengthUserName > 20) {
                $('#errorUsername').html('Please input userName from 6 to 20 characters');
            }
            if (lengthPassword < 6 || lengthPassword > 20) {
                if(username.search('@smartdev.vn')==-1){
                    $('#errorPassword').html('Please input password from 6 to 20 characters');
                }
            }
            if (password != confirmPassword) {
                if(username.search('@smartdev.vn')==-1){
                    $('#errorConfirmPassword').html('Password and confirm password are not alike');
                }
            }
            if (employeeId == "") {
                $('#errEmployee').html('Please choose an Employee')
            }
            if(email == ""){
                $('#errorEmail').html('Please input email address')
            }
              }
         
        
        else {
           if(!that.validateEmail(email)){
               $('#errorEmail').html('Invalid email')
           }
           else {
               var userrole = {
                   essrole: $('#RolesEss option:selected').val(),
                   supervisorrole: $('#RolesSuper option:selected').val(),
                   adminrole: adminRole
               };
               // var getUserFromStore = UserStore.getEdit();
               var getUserFromStore=that.state.userEdit;
                       var user = {
                       usernamepost: getUserFromStore._id,
                       userrole: userrole,
                       username: username,
                       password: password,
                       employeeId: that.state.employeeId,
                       status: status,
                       email : email
                   };
               UserActions.editUser(user, function () {
                   if (UserStore.getExistUser() != null) {
                       var message = UserStore.getExistUser();
                       console.log("message " + message);
                        if(message.error){$('#errorExistUser').html(message.error)}
                       else if(message.success){$('#successAddUser').html(message.success)}
                       setTimeout(function(){
                           RouterContainer.get().transitionTo('/system-user');
                       },1500);
                   }
               });
           }
        }
    }
    else
    {
       var getUserFromStore=that.state.userEdit;
       var userrole = {
                   essrole: $('#RolesEss option:selected').val(),
                   supervisorrole: $('#RolesSuper option:selected').val(),
                   adminrole: adminRole
               };
                       var user = {
                       usernamepost: getUserFromStore._id,
                        userrole: userrole,
                       employeeId: that.state.employeeId,
                       status: status
                   };
               UserActions.editUser(user, function () {
                   if (UserStore.getExistUser() != null) {
                       var message = UserStore.getExistUser();
                       console.log("message " + message);
                        if(message.error){$('#errorExistUser').html(message.error)}
                       else if(message.success){$('#successAddUser').html(message.success)}
                       setTimeout(function(){
                           RouterContainer.get().transitionTo('/system-user');
                       },1500);
                   }
               }); 
    }

    }

    onFocusValidation() {
        $( '#errorUsername' ).html( '' );
        $( '#errorPassword' ).html( '' );
        $( '#errorEmail' ).html( '' );
        $( '#errorConfirmPassword' ).html( '' );
        $( '#errorExistUser' ).html( '' );
        $( '#successAddUser' ).html( '' );
        $('#errEmployee').html('')
        $('#errorUserRole' ).html( '' );
        $('#errorStatus' ).html( '' );

    }

    handleAdminType() {
        $('#errorUserRole').html('');
    }

    render() {
        var rolesEss = this.state.role.map(function (role, index) {
            if (role.type.nameType == "ESS") {
                return (
                    <option value= {role._id} id= {role._id} >{role.name}</option>
                );
            }
        });
        var rolesSuper = this.state.role.map(function (role, index) {
            if (role.type.nameType == "Supervisor") {
                return (
                    <option value= {role._id} id= {role._id} >{role.name}</option>
                );
            }
        });
        var rolesAdmin = this.state.role.map(function (role, index) {

            if (role.type.nameType == "Administrator") {
                return (
                    <option value= {role._id} id= {role._id} >{role.name}</option>
                );
            }
        });
        var options = [];
        var getUserFromStore = this.state.userEdit;
        this.state.listEmployees.map(function (emp) {
            var label = emp.firstName + " " + emp.lastName;
            options.push({value: emp.employeeId, label: label})
        });
        if(getUserFromStore.accType == 1)
        {
            var _selects = (<Select options={options} disabled={true} value={this.state.employeeId} onChange={this.handleEmployee.bind(this)}
            name="form-field-name" />);
        }
        else
        {
            var _selects = (<Select options={options}  value={this.state.employeeId} onChange={this.handleEmployee.bind(this)}
            name="form-field-name" />);
        }
        return (<div>
            <div className="container-fluid">
                <div className="rows">
                    <Breadcumb dataUri={[{'link': 'home', 'name': 'Home'}, {
                        'link': 'system-user',
                        'name': 'Users Management'
                    }]} activeName={getUserFromStore.username} />
                </div>
                <div className="rows">
                    <div className="name-page">Edit System User</div>
                    <div className="panel">
                        <div className="panel-body">
                            <form>
                                <p className="successForm" id="successAddUser"></p>
                                <p className="errorValidation" id="errorExistUser"></p>
                                <div className = "row">
                                    <div className="form-group col-sm-3">
                                        <p>Ess Role</p>
                                        <select id="RolesEss" className = "form-control"  >
                                        {rolesEss}
                                        </select>
                                    </div>
                                    <div className="form-group col-sm-3">
                                        <p>Supervisor Role</p>
                                        <select id="RolesSuper" className = "form-control" >
                                        {rolesSuper}
                                        </select>
                                    </div>
                                    <div className="form-group col-sm-3">
                                        <p>Admin Role</p>
                                        <select id="RolesAdmin" className = "form-control" onChange = {this.handleAdminType.bind(this)}>
                                            <option value= "Select">--Select--</option>
                                        {rolesAdmin}
                                        </select>
                                        <span className="errorValidation" id="errorUserRole"></span>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="form-group col-sm-3">
                                        <label for="exampleInputEmail1">
                                            Login
                                        </label>
                                        <input
                                            type="text"
                                            onChange={ this.handleUserNameChange.bind(this)}
                                            className="form-control"
                                            id="userName"
                                            placeholder="Enter UserName" />
                                        <span className="errorValidation" id="errorUsername"></span>
                                    </div>
                                    <div className="form-group col-sm-3">
                                        <label for="exampleInputEmail1">
                                            Employee Name
                                        </label>
                                {_selects}
                                        <span className="errorValidation" id="errEmployee"></span>
                                    </div>
                                    <div className="form-group col-sm-3">
                                        <label for="exampleInputEmail1">
                                            Email
                                        </label>
                                        <input
                                            type="text"
                                            onChange={ this.handleEmailChange.bind( this )}
                                            className="form-control"
                                            id="email"
                                            placeholder="Input your email address" />
                                        <span className="errorValidation" id="errorEmail"></span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-sm-3">
                                        <label for="exampleInputEmail1">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            onChange={ this.handlePasswordChange.bind(this)}
                                            className="form-control"
                                            id="password"
                                            placeholder="******" />
                                        <span className="errorValidation" id="errorPassword"></span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-sm-3">
                                        <label for="exampleInputEmail1">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            placeholder="******" />
                                        <span className="errorValidation" id="errorConfirmPassword"></span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-sm-3">
                                        <label for="exampleInputEmail1">
                                            Status
                                        </label>
                                        <select id="status" className="form-control">
                                            <option value="1">
                                                Enable
                                            </option>
                                            <option value="0">
                                                Disable
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-sm-3">
                                        <button
                                            className="btn sc-btn-green"
                                            onClick={ this.handleClickSubmit.bind(this)}
                                            id = "editUser"
                                            type="submit">
                                            Save
                                        </button>
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
}
)
;
