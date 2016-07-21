import React from 'react';
import EmployeeActions from '../../actions/EmployeeActions';
import EmployeeStore from '../../stores/EmployeeStore';
import Router from 'react-router';
import UserActions from '../../actions/UserActions';
import RoleActions from '../../actions/RoleActions.js'
import AuthenticatedComponent from '../AuthenticatedComponent';
import UserStore from '../../stores/UserStore';
import RoleStore from '../../stores/RoleStore.js'
import NationalConst from '../../constants/NationalityConst';
import RouterContainer from '../../helper/RouterContainer';
import Permission,{checkFunction} from '../roles/Permission.js';
import LoginStore from '../../stores/LoginStore.js';
import Breadcumb from '../Breadcumb';
var Link = Router.Link;
export default AuthenticatedComponent(
class AddEmployee extends React.Component {
    constructor() {
        super();
        this.state = {imageUpload: null, firstName: '', lastName: '', employeeId: '', username: '', password: '',confirmPass: ''};
    }

    componentWillMount(){
        var _roles = LoginStore.role
        if(checkFunction(_roles,'8','2') == false){
            RouterContainer.get().replaceWith('/error')
        }
    }

    componentDidMount() {

        $("#hs").hide()
        this.getEmployeeId()
        $("#employeeId").prop('disabled', true);
        $("#photo").fileinput({
            allowedFileExtensions: ["jpg", "png", "gif"],
            minImageWidth: 50,
            minImageHeight: 50
        });
    }

    getEmployeeId() {
        EmployeeActions.getEmployeeId(function (data) {
            $("#employeeId").val(data.objectId)
        })
    }

//get data input from UI
    handleFirstNameChange(e) {
        this.setState({firstName: e.target.value})
        $("#errorFirstName").html("");
        $('#errorExistUser').html("")
    }

    handleLastNameChange(e) {
        this.setState({lastName: e.target.value})
        $("#errorLastName").html("");
        $('#errorExistUser').html("")
    }

    handleEmployeeId(e) {
        this.setState({employeeId: e.target.value})
    }

    handleUserNameChange(e) {
        this.setState({username: e.target.value})
        $("#errorUsername").html('');
        $('#errorExistUser').html("")
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value})
        $("#errorPassword").html('');
        $('#errorExistUser').html("")
    }
    handleConfirmPasswordChange(e) {
        this.setState({confirmPass: e.target.value})
        $("#errorConfirmPassword").html('');
        $('#errorExistUser').html("")
    }

    checkInputValue() {
        var userName = this.state.username;
        var password = this.state.password;
        var lengthUserName = userName.length;
        var lengthPassword = password.length;
        if ($("#checkuserlogin").is(':checked')) {
            if (this.state.usernaeme == '' || this.state.password == ''||lengthUserName < 6 || lengthUserName > 20 || lengthPassword < 6 || lengthPassword > 20) {
                if (this.state.username == '') {
                    $("#errorUsername").html("Username is required and can not be empty!")
                }
                if (this.state.password == '') {
                    $("#errorPassword").html("Password is required and can not be empty!")
                }
                if (this.state.confirmPass == '') {
                    $("#errorConfirmPassword").html("Confirm password is required and can not be empty!")
                }
                if ( lengthUserName < 6 || lengthUserName > 20 ) {
                    $( '#errorUsername' ).html( 'Please input userName from 6 to 20 characters' );
                }
                if ( lengthPassword < 6 || lengthPassword > 20 ) {
                    $( '#errorPassword' ).html( 'Please input password from 6 to 20 characters' );
                }
                return false;
            }
            if ($("#password").val() != $("#confirmPassword").val()) {
                $("#errorConfirmPassword").html('Password and confirm password have to be alike')
                return false;
            }
        }
        return true;
    }

    handleUpload(e) {
        var that = this;
        var reader = new FileReader();
        var file = e.target.files[0];
        var img = document.createElement("img");
        var extend = file.name.substring(file.name.length - 3, file.name.length);
        console.log('test extend ' + extend);
        reader.onload = function (e) {

            img.src = e.target.result;
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            var MAX_WIDTH = 270;
            var MAX_HEIGHT = 270;
            var width = img.width;
            var height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            var data = canvas.toDataURL("image/" + extend);
            console.log('this is data get: ' + data);
            that.setState({
                imageUpload: data
            });
        }
        reader.readAsDataURL(file);
    }

//-------------------
    handlerClickSave(e) {
        e.preventDefault()
        $("#errorFirstName").html('');
        $("#errorLastName").html('');
        $("#errorUsername").html('');
        $("#errorPassword").html('');
        $("#errorConfirmPassword").html('');
        if (!this.checkInputValue()) {

        } else {
            if (this.state.firstName == '' || this.state.lastName == '') {
                if (this.state.firstName == '') $("#errorFirstName").html("FirstName is required and can not be empty");
                if (this.state.lastName == '') $("#errorLastName").html("LastName is required and can not be empty");
            } else {
                let that = this
                let _location = $("#location").val()
                let _employeeId = $("#employeeId").val()
                let _employee = {
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    employeeId: _employeeId,
                    location: _location,
                    imageUpload: this.state.imageUpload
                }

                EmployeeActions.addEmployee(_employee, function (msg) {
                    $("#successAddEmpl").html(msg.message)
                    that.resetInputText()
                    if (!($("#checkuserlogin").is(':checked')))
                        that.changeToPersonalPage()
                })
                //if checkbox checked then call service add new user with name employee(first+lastName)
                if ($("#checkuserlogin").is(':checked')) {
                    let _status = $('#status').val()
                    let _employeeId = $('#employeeId').val()
                    var userrole = {
                        essrole:"",
                        supervisorrole: "",
                        adminrole : ""};
                    let _user = {
                        userrole: userrole,
                        username: this.state.username,
                        password: this.state.password,
                        employeeId: _employeeId,
                        status: _status
                    }
                    UserActions.addUser(_user, function () {
                        var error = UserStore.getExistUser();
                        if (error.message != null)
                            $('#errorExistUser').html(error.message); else {
                            $('#successAddUser').html(error.success);
                            $('#userName').val('');
                            $('#password').val('');
                            $('#confirmPassword').val('');
                            that.changeToPersonalPage()
                        }
                    })
                }
            }
        }

    }

    changeToPersonalPage() {
        setTimeout(function () {
            let _employeeId = $("#employeeId").val()
            RouterContainer.get().transitionTo('/personal-details/' + _employeeId)
        }, 2000)
    }

    resetInputText() {
        $("#lastName").val('')
        $("#firstName").val('')
    }

    handlerClick() {
        if ($("#checkuserlogin").is(':checked'))
            $("#hs").show()
        else
            $("#hs").hide()
    }

    render() {
        let _nationals = NationalConst.map(function (country) {
            return (<option value={country.value}>
                        {country.name}
            </option>)
        }.bind(this));
        return (<div>
            <div className="container-fluid">
                <div className="rows">
                    <Breadcumb dataUri={[{'link': 'home', 'name': 'Home'}, {
                        'link': 'employee-list',
                        'name': 'Employee Management'
                    }]} activeName="Add Employee" />
                </div>
                <div className="rows">
                    <div className="name-page">Add Employee </div>
                    <div className="panel">
                        <div className="panel-body">
                            <form>
                                <p className="successForm" id="successAddEmpl"></p>
                                <p className="successForm" id="successAddUser"></p>
                                <p className="errorValidation" id="errorExistUser"></p>
                                <div className="row">
                                    <div className="form-group col-sm-3">
                                        <label for="exampleInputEmail1">First Name</label>
                                        <input onChange={this.handleFirstNameChange.bind(this)} type="text" className="form-control" id="firstName" placeholder="Enter first name" />
                                        <p className="errorValidation" id="errorFirstName"></p>
                                    </div>
                                    <div className="form-group col-sm-3">
                                        <label for="exampleInputEmail1">Last Name</label>
                                        <input onChange={this.handleLastNameChange.bind(this)} type="text" className="form-control" id="lastName" placeholder="Enter last name" />
                                        <p className="errorValidation" id="errorLastName"></p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-sm-3">
                                        <label for="exampleInputEmail1">Employee Id</label>
                                        <input onChange={this.handleEmployeeId.bind(this)} type="text" className="form-control" id="employeeId" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-sm-4">
                                        <label for="exampleInputEmail1">Photograph</label>
                                        <input id="photo" type="file" class="file" multiple="false" data-show-upload="false" data-show-caption="true" onChange = {this.handleUpload.bind(this)} />
                                        <h6>Accepts ,jpg, .png, .gif up to 50MB </h6>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-sm-6">
                                        <label className="col-sm-4" for="exampleInputEmail1">Create Login Details</label>
                                        <input className="col-sm-1" type="checkbox" id="checkuserlogin" onClick={this.handlerClick} />
                                    </div>
                                </div>
                                <div id="hs">
                                    <hr className="break" />
                                    <div className="row">
                                        <div className="form-group col-sm-3">
                                            <label for="exampleInputEmail1">Login</label>
                                            <input onChange={this.handleUserNameChange.bind(this)} type="text" className="form-control" id="userName" placeholder="Enter UserName" />
                                            <span className="errorValidation" id="errorUsername"></span>
                                        </div>
                                        <div className="form-group col-sm-3">
                                            <label for="exampleInputEmail1">Status</label>
                                            <select id="status" className="form-control">
                                                <option value="1">Enable</option>
                                                <option value="0">Disable</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-sm-3">
                                            <label for="exampleInputEmail1">Password</label>
                                            <input onChange={this.handlePasswordChange.bind(this)} type="password" className="form-control" id="password" placeholder="******" />
                                            <span className="errorValidation" id="errorPassword"></span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-sm-3">
                                            <label for="exampleInputEmail1">Confirm Password</label>
                                            <input onChange={this.handleConfirmPasswordChange.bind(this)} type="password" className="form-control" id="confirmPassword" placeholder="******" />
                                            <span className="errorValidation" id="errorConfirmPassword"></span>
                                        </div>
                                    </div>
                                </div>
                                <hr className="break" />
                                <div className="row">
                                    <div className="form-group col-sm-3">
                                        <label for="exampleInputEmail1">Location</label>
                                        <select id="location" className="form-control">
                                             {_nationals}
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-sm-3">
                                        <button onClick={this.handlerClickSave.bind(this)} className="btn sc-btn-green" type="submit">Save</button>
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