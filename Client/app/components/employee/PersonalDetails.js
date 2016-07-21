
import React from 'react';
import UserActions from '../../actions/UserActions';
import UserStore from '../../stores/UserStore';
import Router from 'react-router';
import AuthenticatedComponent from '../AuthenticatedComponent';
import EmployeeActions from '../../actions/EmployeeActions';
import EmployeeStore from '../../stores/EmployeeStore';
import NationalConst from '../../constants/NationalityConst';
import Permission,{checkFunction} from '../roles/Permission.js';
import RouterContainer from '../../helper/RouterContainer';
import LoginStore from '../../stores/LoginStore.js';
import Breadcumb from '../Breadcumb';
var Link = Router.Link;
import Select from 'react-select';
export default AuthenticatedComponent(class PersonalDetails extends React.Component
{
    constructor() {
        super();
        this.state = {
            firstName: '',
            lastName: '',
            employeeId: '',
            DLNumber: '',
            licenseExpiryData: '',
            gender: -1,
            maritalStatus: -1,
            nickName: '',
            dateOfBirth: '',
            nationality: '',
            bloodGroup:'',
            imageUpload: '',
            imageBuffer: '',
            defaultImage : ''
        }
    }

    componentWillMount(){
        var _roles = LoginStore.role
        if(checkFunction(_roles,'8','2') == false){
            RouterContainer.get().replaceWith('/error')
        }
    }

    componentDidMount() {
        $("#target :input").prop("disabled", true)
        let _employeeId = this.props.params.employeeId
        this.setState({employeeId: _employeeId})

        $("#employeeId").val(_employeeId)
        var that = this
        EmployeeActions.getAnEmployee(this.props.params.employeeId, function(data) {
            if (data.firstName){
                $("#firstName").val(data.firstName)
                that.setState({firstName: data.firstName})
            }
            if (data.lastName){
                $("#lastName").val(data.lastName)
                that.setState({lastName: data.lastName})
            }
            if (data.DLNumber) $("#DvLNumber").val(data.DLNumber)
            if (data.licenseExpiryData) $("#LEdate").val(data.licenseExpiryData)
            if (data.gender) $('input[name=optradio]').val([data.gender])
            if (data.maritalStatus) $("#maritalStatus").val(data.maritalStatus)
            if (data.dateOfBirth) $("#dateOfBirth").val(data.dateOfBirth)
            if (data.nickName) $("#nickName").val(data.nickName)
            if (data.nationality) $("#nationality").val(data.nationality)
            if (data.bloodGroup) $("#bloodGroup").val(data.bloodGroup)
            that.setState({imageUpload: data.imageUpload})
            $("#photo").fileinput({
                allowedFileExtensions: ["jpg", "png", "gif"],
                minImageWidth: 50,
                minImageHeight: 50
            });
            jQuery.get('Server/data/imageDefault.txt', function(data) {
                that.setState({defaultImage: data})
            });
        })
    }

//get data input from UI
    getValueFromInput() {
        let _firstName = $("#firstName").val()
        let _lastName = $("#lastName").val()
        let _employeeId = $("#employeeId").val()
        let _DLNumber = $("#DvLNumber").val()
        let _licenseExpiryData = $("#LEdate").val()
        let _gender = $('input[name=optradio]:checked', '#myForm').val()
        let _maritalStatus = $("#maritalStatus").val()
        let _dateOfBirth = $("#dateOfBirth").val()
        let _nickName = $("#nickName").val()
        let _nationality = $("#nationality").val()
        let _bloodGroup = $("#bloodGroup").val()
        this.setState({
            firstName: _firstName,
            lastName: _lastName,
            employeeId: _employeeId,
            DLNumber: _DLNumber,
            licenseExpiryData: _licenseExpiryData,
            gender: _gender,
            maritalStatus: _maritalStatus,
            nickName: _nickName,
            dateOfBirth: _dateOfBirth,
            nationality: _nationality,
            bloodGroup : _bloodGroup
        })
    }
//-------------------
    handlerClick(e) {
        if ($("#checkuserlogin").is(':checked'))
            $("#hs").show()
        else
            $("#hs").hide()
    }

    handleValidate() {
        setTimeout( function () {
            document.getElementById( 'successAddUser' ).innerHTML = "";
        }, 3000 )
    }
//Change photo
    handleUpload(e){
        var that = this;
        var reader = new FileReader();
        var file = e.target.files[0];
        var img = document.createElement("img");
        var extend =  file.name.substring(file.name.length-3, file.name.length);
        console.log('test extend '+ extend);
        reader.onload = function(e) {

            img.src = e.target.result;
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            var MAX_WIDTH = 270  ;
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

            var data = canvas.toDataURL("image/"+extend);
            console.log('this is data get: '+ data);
            that.setState({
                imageBuffer: data
            });
        }
        reader.readAsDataURL(file);
    }
    handleChangePhoto(e){
        e.preventDefault()
        $("#changePhoto").toggle();
    }
    upload(){
        var _firstName = $("#firstName").val()
        var _lastName = $("#lastName").val()
        var _bloodGroup = $('#bloodGroup').val()
        if(_firstName ==""|| _lastName ==""){
            if(_firstName==""){
                $("#errorFirstName").html('Please input first name')
            }
            else{
                $("#errorLastName").html('Please input last name')
            }
        }
        if(_bloodGroup == -1){
            $("#errorBloodGroup").html('Please choose blood group')
        }
        else{
            this.setState({imageUpload: this.state.imageBuffer})
            $("#changePhoto").hide()
            this.getValueFromInput()
            let that = this
            setTimeout(function(){
                EmployeeActions.updateEmployee(that.state, function(){
                    $("#target :input").prop("disabled", true)
                    $("#btnSave").html('Edit')
                })
            },1)
        }
    }
    handleFirstName(){
        $("#errorFirstName").html('')
    }
    handleLastName(){
        $("#errorLastName").html('')
    }
    handleBloodGroup(){
        $("#errorBloodGroup").html('')
    }
//----------------------------------------
    handlerClickSave(e) {
        e.preventDefault()
        var _firstName = $("#firstName").val()
        var _lastName = $("#lastName").val()
        var _bloodGroup = $('#bloodGroup').val()
        if ($("#btnSave").html() == 'Edit') {
            $("#target :input").prop("disabled", false)
            $("#employeeId").prop('disabled', true)
            $("#btnSave").html('Save')
        } else {
            if(_firstName ==""|| _lastName ==""){
                if(_firstName==""){
                    $("#errorFirstName").html('Please input first name')
                }
                else{
                    $("#errorLastName").html('Please input last name')
                }
            }
            if(_bloodGroup == -1){
                $("#errorBloodGroup").html('Please choose blood group')
            }
            else{
                this.getValueFromInput()
                let that = this
                setTimeout(function(){
                    EmployeeActions.updateEmployee(that.state, function(msg){
                        $("#successAddUser").html(msg.message)
                        $("#target :input").prop("disabled", true)
                        $("#btnSave").html('Edit')
                        that.handleValidate()
                    })
                },1)
            }
        }
    }
    render() {
        var _nationality = NationalConst.map(function(country) {
            return (<option value={country.value}>{country.name}</option>)
        }.bind(this))
        var that = this
        var image
        if(this.state.imageUpload==""){
            image = that.state.defaultImage
        }
        else{
            image = that.state.imageUpload
        }
        var name = this.state.firstName+" "+this.state.lastName

        return (<div>
            <div className="container-fluid">
                <div className="rows">
                    <Breadcumb dataUri={[{'link':'home','name':'Home'},{'link':'employee-list','name':'Employee Management'}]} activeName="Personal Details" />
                </div>
                <div className="rows">
                <div className="name-page">Personal Details</div>
                <div className = "panel">
                    <div className="row">
                        <div className = "col-xs-12 col-md-3">
                            <div className = "panel">
                                <div className = "panel-body">
                                    <form >
                                        <h4 className="text-primary">{name}</h4>
                                        <img  className = "img img-responsive" src={image}/>
                                        <br></br>
                                        <a href onClick ={this.handleChangePhoto.bind(this)} >Change photo</a>
                                        <div id = "changePhoto" hidden="hidden" >
                                            <input id="photo" type="file" class="file" multiple="false" data-show-upload="false" data-show-caption="true" onChange = {this.handleUpload.bind(this)} />
                                            <h6>Accepts ,jpg, .png, .gif up to 50MB </h6>
                                            <input type = "button" value = "Upload" className = "btn btn-primary" onClick = {this.upload.bind(this)}></input>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className = "col-xs-12 col-md-9">
                            <div className="panel panel-default">
                                <div className="panel-body">
                                    <form id="target">
                                        <p className="successForm" id="successAddUser"></p>
                                        <p className="errorValidation" id="errorExistUser"></p>
                                        <div className="row">
                                            <div className="form-group col-sm-3">
                                                <label for="exampleInputEmail1">First Name *</label>
                                                <input type="text" className="form-control" id="firstName" onChange = {this.handleFirstName.bind(this)} placeholder="Enter first name" />
                                                <span className="errorValidation" id="errorFirstName"></span>
                                            </div>
                                            <div className="form-group col-sm-3">
                                                <label for="exampleInputEmail1">Last Name *</label>
                                                <input type="text" className="form-control" id="lastName" onChange = {this.handleLastName.bind(this)} placeholder="Enter last name" />
                                                <span className="errorValidation" id="errorLastName"></span>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-sm-3">
                                                <label for="exampleInputEmail1">Employee Id</label>
                                                <input type="text" className="form-control" id="employeeId" />
                                            </div>
                                        </div>
                                        <hr className="break" />
                                        <div className="row">
                                            <div className="form-group col-sm-3">
                                                <label for="exampleInputEmail1">Driver's License Number'</label>
                                                <input type="text" className="form-control" id="DvLNumber" />
                                            </div>
                                            <div className="form-group col-sm-3">
                                                <label for="exampleInputEmail1">License Expiry Date</label>
                                                <input type="date" className="form-control" id="LEdate" />
                                            </div>
                                            <div className="form-group col-sm-3">
                                                <label for="exampleInputEmail1">Gender</label>
                                                <div className="radio" id="myForm">
                                                    <label>
                                                        <input type="radio" name="optradio" value="1" />Male</label>
                                                    <label>    </label>
                                                    <label>
                                                        <input type="radio" name="optradio" value="0" />Female</label>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="break" />
                                        <div className="row">
                                            <div className="form-group col-sm-3">
                                                <label for="exampleInputEmail1">Nick Name</label>
                                                <input type="text" className="form-control" id="nickName" />
                                            </div>
                                            <div className="form-group col-sm-3">
                                                <label for="exampleInputEmail1">Date of Birth</label>
                                                <input type="date" className="form-control" id="dateOfBirth" />
                                            </div>
                                            <div className="form-group col-sm-3">
                                                <label for="exampleInputEmail1">Blood Group *</label>
                                                <select id="bloodGroup" className="form-control" onChange = {this.handleBloodGroup.bind(this)}>
                                                    <option value="-1"> -- Select -- </option>
                                                    <option value="0">A+</option>
                                                    <option value="1">A-</option>
                                                    <option value="2">B+</option>
                                                    <option value="3">B-</option>
                                                    <option value="4">AB+</option>
                                                    <option value="5">AB-</option>
                                                    <option value="6">O+</option>
                                                    <option value="7">O-</option>
                                                </select>
                                                <span className="errorValidation" id="errorBloodGroup"></span>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-sm-3">
                                                <label for="exampleInputEmail1">Marital Status</label>
                                                <select id="maritalStatus" className="form-control">
                                                    <option value="-1"> -- Select -- </option>
                                                    <option value="0">Single</option>
                                                    <option value="1">Married</option>
                                                    <option value="2">Other</option>
                                                </select>
                                            </div>
                                            <div className="form-group col-sm-3">
                                                <label for="exampleInputEmail1">Nationality</label>
                                                <select id="nationality" className="form-control">
                                                    <option value="0"> -- Select -- </option>
                                                        {_nationality}
                                                </select>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="row">
                                        <div className="form-group col-sm-3">
                                            <button onClick={this.handlerClickSave.bind(this)} className="btn sc-btn-green" type="submit" id="btnSave">Edit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        );
    }
});