/**
 * Created by ThuanLe on 6/24/2015.
 */
import React from 'react';
import UserActions from '../../actions/UserActions';
import UserStore from '../../stores/UserStore';
import Router from 'react-router';
import AuthenticatedComponent from '../AuthenticatedComponent';
import Autosuggest from 'react-autosuggest';
import EmployeeAction from '../../actions/EmployeeActions';
import EmployeeStore from '../../stores/EmployeeStore';
import RoleStore from '../../stores/RoleStore.js';
import RoleActions from '../../actions/RoleActions.js';
import Permission,{checkHeader} from '../roles/Permission.js';
import LoginStore from '../../stores/LoginStore.js';
import RouterContainer from '../../helper/RouterContainer';
import Breadcumb from '../Breadcumb';
import Select from 'react-select';
var Link = Router.Link;
export default AuthenticatedComponent( class SaveSystemUser extends React.Component
{
    constructor()
    {
      super();
      this.state = {listEmployees: [], role : [], employeeId:"", password:"",username:"",status:"1", email: ''}
    }
    getEmployees()
    {
        return {listEmployees:EmployeeStore.getEmployeeList()};
    }
    getRoles()
    {
        return { role: RoleStore.getRoles() }
    }
    componentWillMount()
    {
      var that = this
        this._roles = LoginStore.role
        if(!checkHeader(this._roles,'0')){
            RouterContainer.get().replaceWith('/error')
        }
        EmployeeAction.getEmployee( function () {
        that.setState( that.getEmployees() )
      } )
        RoleActions.getRole( function () {
            that.setState( that.getRoles() )
        } )
    }
    handleUserNameChange( e )
    {
      this.state.username= e.target.value;
      this.onFocusValidation();
    }
    handlePasswordChange( e )
    {
      this.state.password= e.target.value;
      this.onFocusValidation();
    }
    handleEmailChange( e )
    {
        this.state.email= e.target.value;
        this.onFocusValidation();
    }
    handleEmployee(val)
    {
        this.state.employeeId= val;
        this.onFocusValidation();
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
    handleClickSubmit( e )
    {
      e.preventDefault();
      var userName = this.state.username;
      var password = this.state.password;
      var employeeId=this.state.employeeId;
      var email = this.state.email;
      var status=this.state.status;
      var adminRole = $('#RolesAdmin option:selected').val()
      var confirmPassword = $( '#confirmPassword' ).val();
      var lengthUserName = userName.length;
      var lengthPassword = password.length;
      var that = this;
        if(adminRole =="Select")
        {
                adminRole = "";
        }
        if ( employeeId==0|| lengthUserName < 6 || lengthUserName > 20 || lengthPassword < 6 || lengthPassword > 20 || password != confirmPassword || employeeId == "" || status == ""|| email=="") {
            if ( lengthUserName < 6 || lengthUserName > 20 ) {
                $( '#errorUsername' ).html( 'Please input userName from 6 to 20 characters' );
            }
            if ( lengthPassword < 6 || lengthPassword > 20 ) {
                $( '#errorPassword' ).html( 'Please input password from 6 to 20 characters' );
            }
            if ( password != confirmPassword ) {
                $( '#errorConfirmPassword' ).html( 'Password and confirm password are not alike' );
            }
            if(employeeId == "")
            {
                $('#errEmployee').html('Please choose an Employee')
            }
            if(email ==""){
                $('#errorEmail').html('Please input email address')
            }
        } else {
            if(!that.validateEmail(email)){
                $('#errorEmail').html('Invalid email')
            }
            if(userName.search(' ')!=-1){
                $( '#errorUsername' ).html( 'Username must not have space character' );
            }
            else{
                var userrole = {essrole:$('#RolesEss option:selected').val(),
                    supervisorrole: $('#RolesSuper option:selected').val(),
                    adminrole :adminRole};
                var user = {
                    userrole: userrole,
                    username: that.state.username,
                    password: that.state.password,
                    employeeId: that.state.employeeId,
                    status: that.state.status,
                    email : that.state.email
                };
                UserActions.addUser( user, function () {
                    if ( UserStore.getExistUser() != null ) {
                        var error = UserStore.getExistUser();
                        if ( error.message != null )
                            $( '#errorExistUser' ).html( error.message ); else {
                            $( '#successAddUser' ).html( error.success );
                            $( '#userName' ).val( '' );
                            $( '#password' ).val( '' );
                            $( '#email' ).val( '' );
                            $( '#confirmPassword' ).val( '' );
                        }
                    }
                } );
            }
    }
    }
onFocusValidation()
{
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
handleAdminType()
{
    $( '#errorUserRole' ).html( '' );
}
render() {
    var rolesEss = this.state.role.map( function ( role, index) {
        if(role.type.nameType == "ESS"){
            return (
                <option value= {role._id} id= {role._id} >{role.name}</option>
            );
        }
    } );
    var rolesSuper = this.state.role.map( function ( role, index) {
        if(role.type.nameType == "Supervisor"){
            return (
                <option value= {role._id} id= {role._id} >{role.name}</option>
            );
        }
    } );
    var rolesAdmin = this.state.role.map( function ( role, index) {

        if(role.type.nameType == "Administrator"){
            return (
                <option value= {role._id} id= {role._id} >{role.name}</option>
            );
        }
    } );
var options = [];
this.state.listEmployees.map(function(emp){
    var label=emp.firstName + " " + emp.lastName;
    options.push({value:emp.employeeId,label:label})
});
var _selects=(<Select onChange={this.handleEmployee.bind(this)}
name="form-field-name"
options={options} />);
  return (<div>
            <div className="container-fluid">
              <div className="rows">
              <Breadcumb dataUri={[{'link':'home','name':'Home'},{'link':'system-user','name':'Users Management'}]} activeName="Add User" />
              </div>
              <div className="rows">
                <div className="name-page">Add User</div>
                <div className="panel">
                  <div className="panel-body">
                    <form>
                      <p className="successForm" id="successAddUser"></p>
                      <p className="errorValidation" id="errorExistUser"></p>
                      <div className = "row">
                          <div className="form-group col-sm-3">
                              <p>Ess Role</p>
                              <select id="RolesEss" className = "form-control"  >
                              <option value= "Select">--Select--</option>
                                    {rolesEss}
                              </select>
                          </div>
                          <div className="form-group col-sm-3">
                              <p>Supervisor Role</p>
                              <select id="RolesSuper" className = "form-control" >
                              <option value= "Select">--Select--</option>
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
                                 onChange={ this.handleUserNameChange.bind( this )}
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
                                 onChange={ this.handlePasswordChange.bind( this )}
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
                          <select onChange={this.handleStatusChange.bind(this)} className="form-control">
                            <option selected value="1">Enable</option>
                            <option value="0">Disable</option>
                          </select>
                         <span className="errorValidation" id="errorStatus"></span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-sm-3">
                          <button
                                  className="btn sc-btn-green"
                                  onClick={ this.handleClickSubmit.bind( this )}
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
} );
