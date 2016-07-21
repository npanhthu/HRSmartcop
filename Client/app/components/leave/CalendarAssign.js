import React from "react";
import moment from "moment";
import DayPicker from "react-day-picker";
import EmployeeStore from '../../stores/EmployeeStore';
import LeaveAction from '../../actions/LeaveActions';
import LeaveStore from '../../stores/LeaveStore';
import EmployeeAction from '../../actions/EmployeeActions';
import UserAction from '../../actions/UserActions.js';
import UserStore from '../../stores/UserStore.js';
import AuthenticatedComponent from '../AuthenticatedComponent';
import {isPastDay, isSameDay} from "../../../style/calendar/DateUtils"
import LeaveActions from '../../actions/LeaveActions.js';
import Colors from '../../constants/data/colorsConstant.js';
import TimeConstant from '../../constants/data/timeConstants.js';
import RouterContainer from '../../helper/RouterContainer';
import Permission,{checkHeader} from '../roles/Permission.js';
import LoginStore from '../../stores/LoginStore.js';
import Select from 'react-select';
import Breadcumb from '../Breadcumb';
export default AuthenticatedComponent( class CalendarAssign extends React.Component {

    constructor(props) {
        super(props);
        const today = new Date();
        this.state = {
            value: moment(today).format("L"), month: today,
            ListEmployee: [], ListLeaveType: [], _assignList1:[],
            userName: '', employeeID: '', user:'',

            ID:'', employeeState:'', leaveTypeIdState:'', leaveTypeState: '',
            fromDateState:'', toDateState:'', fromTime:'', toTime:'',

            action:'', IdMore:''
        };
        this.renderDay = this.renderDay.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.onRightMouse = this.onRightMouse.bind(this);
        this.popoverInitialized = {};
        this.popoverListItem = {};
    }

    getEmployees() {return {ListEmployee: EmployeeStore.getEmployeeList()}}
    getLeaveTypes() {return {ListLeaveType: LeaveStore.getLeaveType()}}
    getUserId() {return {userName: UserStore.getId()}}

    componentWillMount() {
        var _roles = LoginStore.role
        if (!checkHeader(_roles, '6')) {
            RouterContainer.get().replaceWith('/error')
        }
        var username = this.props.user.username;
        this.setState({user:username})
         var that = this
        EmployeeAction.getEmployee(function () {
            that.setState(that.getEmployees());
        })
        UserAction.getAUser(username, function () {
            that.setState(that.getUserId());
            if (that.state.userName == '') {
                LeaveAction.getAll(function () {
                    that.setState(that.getLeaveTypes());
                });

            } else {
                LeaveAction.getLeaveType(that.state.userName, function () {
                    that.setState(that.getLeaveTypes());
                });
            }
            that.reloadPage();
        })
    }

    reloadPage(){
        var that = this;
        if (that.state.userName == ''){
            LeaveActions.getListAssign( function () {
                that.setState({ID:'',IdMore:'', _assignList1:LeaveStore.assignList})
                console.log("Assign leave 1 " , that.state._assignList1);
            })
        }else{
            LeaveActions.getListAssignUser(that.state.userName, function () {
                that.setState({ID:'',IdMore:'', _assignList1:LeaveStore.assignList})
                console.log("Assign leave 2 " , that.state._assignList1);
            })
        }
    }

    componentDidMount() {
        $("#datePickerFrom").datepicker();
        $("#datePickerTo").datepicker();
    }

    setValidateEmpty(){
        $('#errorEmployee').html('');
        $('#errorLeaveType').html('');
        $('#errorFromDate').html('');
        $('#errorToDate').html('');
    }

    _getDate(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyy = today.getFullYear();
        if(dd<10) {
            dd='0'+dd
        }
        if(mm<10) {
            mm='0'+mm
        }
        today = mm+'/'+dd+'/'+yyy;
        return today;
    }

    validate(){
        if(this.state.userName == ''){
            var employeeId = this.state.employeeID;
        }else{
            var employeeId = this.state.userName;
        }
        var leaveTypeId = $('#leaveType').val();
        var fromDate = $('#datePickerFrom').val();
        var toDate = $('#datePickerTo').val();
        var dateNow = this._getDate();
        var fromTime = $('#fromTime').val();
        var toTime = $('#toTime').val();
        if(employeeId == ''){
            $('#errorEmployee').html('Employee is required and can not be empty');
        }else if(leaveTypeId == '-1'){
            $('#errorLeaveType').html('Leave Type is required and can not be empty');
        }else if(fromDate ==''){
            $('#errorFromDate').html('From date is required and can not be empty');
        }else if(toDate == ''){
            $('#errorToDate').html('To date is required and can not be empty');
        }else if(fromDate > toDate){
            $('#errorFromDate').html('From date need less than to date');
            $('#errorToDate').html('From date need less than to date');
        }else if(dateNow > fromDate){
            $('#errorFromDate').html('From date need bigger than date now');
        }else if(fromTime == ''){
            $('#errorFromDate').html('From time is required and can not be empty');
        }else if(toTime == ''){
            $('#errorToDate').html('To time is required and can not be empty');
        }else if(fromDate == toDate){
            if(fromTime == 'Afternoon' && toTime == 'Morning'){
                $('#errorFromDate').html('The time not correct, please choice again');
                $('#errorToDate').html('The time not correct, please choice again');
            }
        }
    }

    onSubmit(e) {
        e.preventDefault();
        var that = this;
        this.setValidateEmpty();
        var leaveTypeId = $('#leaveType').val();
        console.log("leave type id " + leaveTypeId);
        var leaveType ='';
        var status = '';
        var color='';
        for(var i=0;i<this.state.ListLeaveType.length;i++){
            if(this.state.ListLeaveType[i].leaveType.leavetype_id)
            {
                if(this.state.ListLeaveType[i].leaveType.leavetype_id == leaveTypeId)
                {
                    leaveType=this.state.ListLeaveType[i].leaveType.name
                    color = that.state.ListLeaveType[i].leaveType.color
                }
            } else if(this.state.ListLeaveType[i]._id == leaveTypeId){
                leaveType = this.state.ListLeaveType[i].leaveType
                color = this.state.ListLeaveType[i].color;
            }
        }

        if(this.state.userName == ''){
            var employeeId = this.state.employeeID;
            status = '1';
        }else{
            var employeeId = this.state.userName;
            status = '0';
        }
        var fromDate = $('#datePickerFrom').val();
        var fromTime = $('#fromTime').val();
        var toDate = $('#datePickerTo').val();
        var toTime = $('#toTime').val();
        var comment = $('#comment').val();
        var dateNow = this._getDate();
        var identify = '';
        if(this.state.ID){
            var _identify = this.state.ID.split('_');
            identify = _identify[0];
        }
        if(employeeId == ''||fromDate ==''||leaveTypeId == '-1'||toDate == ''||fromDate > toDate || dateNow > fromDate || fromTime == '' || toTime == ''|| ((fromDate == toDate)&& (fromTime == 'Afternoon' && toTime == 'Morning'))){
            this.validate();
        }else{
            let _assign = {
                _employeeId:employeeId, _leaveTypeId:leaveTypeId, _fromDate:fromDate, _toDate:toDate, _comment:comment,_identify:identify,_fromTime:fromTime, _toTime:toTime, _color:color, _user: that.state.user, _leaveType:leaveType, _status:status
            }
            LeaveAction.schedulerAssign(_assign, function(){
                var message = LeaveStore.getMessage;
                if(message.msg == "Success"){
                    $('#success').html('You assign successful');
                }else if(message.msg == "Update successful"){
                    $('#success').html('Update successful');
                }else{
                    $('#errorResult').html(message.msg);
                }
                setTimeout( function () {
                    that.setState({employeeID: '',fromDateState:'',toDateState:'',leaveTypeIdState:'',leaveTypeState:'',ID:'',fromTime:'',toTime:'', action:''});
                    $("#comment").val('');
                    $('#success').html('');
                    $('#errorResult').html('');
                    $('#myModal').modal('hide');
                    that.reloadPage();
                }, 500 )
            })
        }
    }

    onDelete(ID){
        var that = this;
        var str = ID.split('_');
        var id = "#" + ID;
        $(id).popover('hide');
        bootbox.confirm("Are you sure you want to permanently delete these records?", function(result) {
            if (result) {
                LeaveAction.deleteAssign(str[0], function(){
                    setTimeout( function () {
                        that.setState({employeeID: '',fromDateState:'',toDateState:'',leaveTypeIdState:'',leaveTypeState:'',ID:'',fromTime:'',toTime:'', action:''});
                        $("#comment").val('');
                        $('#success').html('');
                        $('#errorResult').html('');
                        $('#myModal').modal('hide');
                        that.reloadPage();
                    }, 500 )
                })
            }
        })
    }
    static displayName = "BirthdaysExample"

    handleDayClick(e, day) {
        if(this.state.ID){var _id = "#" + this.state.ID; $(_id).popover('hide');}
        if(this.state.IdMore) {var _IdMore = "#" + this.state.IdMore; $(_IdMore).popover('hide');}
    }

    handleEmployee(val) {
        $('#errorValidateEmployeeName').html('');
        this.state.employeeID = val;
        var that = this;
        if(this.state.employeeID){
            LeaveAction.getLeaveType(that.state.employeeID, function () {
                that.setState({ListLeaveType: LeaveStore.getLeaveType()});
            });
            UserAction.getUserName(that.state.employeeID, function(){
                that.setState({user: UserStore.getUserName()});
            })
        }else{
            LeaveAction.getAll(function () {
                that.setState({ListLeaveType: LeaveStore.getLeaveType()});
            });
        }

    }

    handleAdd(){
        if(this.state.ID){var _id = "#" + this.state.ID; $(_id).popover('hide');}
        this.setState({action:'add'})
        this.setState({employeeID: '',fromDateState:'',toDateState:'',leaveTypeIdState:'',leaveTypeState:'',ID:'',fromTime:'',toTime:''});
        $("#comment").val('');
        $("#fromTime").val('FullDay');
        $("#toTime").val('FullDay');
    }

    tableStyle(){

    }

    render() {
        var that = this;
        const { value, month } = this.state;
        var options = [];
        this.state.ListEmployee.map(function (emp) {
            var label = emp.firstName + " " + emp.lastName;
            options.push({value: emp.employeeId, label: label})
        });
        var _selects = (<div className="col-sm-6"><Select onChange={this.handleEmployee.bind(this)}
            name="form-field-name"
            value={that.state.employeeID}
            options={options} /></div>);

        var _employeeShow = function () {
            if (that.state.userName != '') {
                return (<div></div>)
            } else {
                return (<div className="form-group">
                    <label className="control-label label-color col-sm-offset-1 col-sm-3">Employee:</label>
                    {_selects}
                    <span className="errorValidation col-sm-offset-4 col-sm-8" id="errorEmployee"></span>
                </div>)
            }
        }

        var footer = function(){
            if(that.state.action=='add'){
                return(<input type="button" className="btn sc-btn-green pull-right"  onClick={that.onSubmit.bind(that)} value="Assign"/>)
            }else {
                return(<div><input type="button" className="btn sc-btn-green pull-right" value="Save" onClick={that.onSubmit.bind(that)}/></div>)
            }
        }

        var header = function(){
            if(that.state.action=='add'){
                return(<h4 className="modal-title">Add new assign leave</h4>)
            }else {return(<h4 className="modal-title">Edit assign leave</h4>)}
        }

        var _leaveType = this.state.ListLeaveType.map(function (leaveType) {
            if (leaveType.entitlementDay) {
                return (<option value={leaveType.leaveType.leavetype_id}>{leaveType.leaveType.name}</option>)
            } else {
                return (<option value={leaveType._id}>{leaveType.leaveType}</option>)
            }
        })

        return <div><div style={{width:"100%"}} className="container-fluid">
                        <div className="rows">
                            <Breadcumb dataUri={[{'link':'home','name':'Home'}]} activeName="Calendar" />
                        </div>
                        <div>
                            <div className="name-page">Leave Calendar</div>
                            <div className="panel">
                                <div className="row">
                                    <div className="panel-heading sc-panel-heading">
                                        <button style={{marginLeft:"2%"}} className="btn btncreative btn-5 btn-5b icon-plus sc-btn-align-panel-heading"  data-toggle="modal" data-target="#myModal" onClick={this.handleAdd.bind(this)}><span>Add New</span></button>
                                    </div>
                                </div>
                                <div style={{overflow:'scroll'}}><div className="rows">
                                    <DayPicker canChangeMonth={true}
                                        ref="daypicker"
                                        enableOutsideDays={false}
                                        className="Birthdays"
                                        initialMonth={ month }
                                        numberOfMonths={ 1 }
                                        renderDay={ this.renderDay }
                                        onDayClick={this.handleDayClick} />
                                </div></div>
                            </div>
                        </div>
                        <div id="myModal" className="modal fade" role="dialog">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header sc-modal-header-assign">
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                        {header()}
                                    </div>
                                    <div className="modal-body form-horizontal" style={{background:'white'}} role="form">
                                        <span className="successForm col-sm-offset-4 col-sm-8" id="success"></span>
                                        <span className="errorValidation col-sm-offset-4 col-sm-8" id="errorResult"></span>
                                        {_employeeShow()}
                                        <br />
                                        <div className="form-group">
                                            <label for="leaveType" className="control-label label-color col-sm-offset-1 col-sm-3">Leave Type:</label>
                                            <div className="col-sm-6"><select id="leaveType" className="form-control">
                                                {_leaveType}
                                            </select></div>
                                            <span className="errorValidation col-sm-offset-4 col-sm-8" id="errorLeaveType"></span>
                                        </div>
                                        <br />
                                        <div className="form-group">
                                            <label for="datePickerFrom" className="control-label label-color col-sm-offset-1 col-sm-3">From date : </label>
                                            <div className="col-sm-4"><input type="text" id="datePickerFrom" className="form-control" value={this.state.fromDateState}  placeholder="From date"/></div>
                                            <div className="col-sm-3"><select id="fromTime" className="form-control"><option value="FullDay">FullDay</option><option value="Morning">Morning</option><option value="Afternoon">Afternoon</option></select></div>
                                            <span className="errorValidation col-sm-offset-4 col-sm-8" id="errorFromDate"></span>
                                        </div>
                                        <br />
                                        <div className="form-group">
                                            <label for="datePickerTo" className="control-label label-color col-sm-offset-1 col-sm-3">To date : </label>
                                            <div className="col-sm-4"><input type="text" id="datePickerTo" className="form-control" value={this.state.toDateState} placeholder="To date" /></div>
                                            <div className="col-sm-3"><select id="toTime" className="form-control"><option value="FullDay">FullDay</option><option value="Morning">Morning</option><option value="Afternoon">Afternoon</option></select></div>
                                            <span className="errorValidation col-sm-offset-4 col-sm-8" id="errorToDate"></span><br />
                                        </div>
                                        <div className="form-group">
                                            <label for="comment" className="control-label label-color col-sm-offset-1 col-sm-3">Comment : </label>
                                            <div className="col-sm-6"><textarea className="form-control" rows="2" id="comment" placeholder="Write something here to comment"></textarea></div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        {footer()}
                                    </div>
                                </div>
                            </div>
                        </div>
                </div></div>
    }

    active(color){
        return{
            color: 'white',
            background:color,
            border:'none'
        }
    }

    onClickEdit(ID){
        ID = "#" + ID;
        $(ID).popover('hide');
    }

//identify - 0,date - 1,fromDate - 2,toDate - 3,fromTime - 4,toTime - 5,comment - 6,user - 7,leaveTypeId - 8 ,leaveType - 9
    onRightMouse(str){
        var data = str.split('*');
        console.log("Data", data);
        if(this.state.ID && this.state.ID != data[0]){var _id = "#" + this.state.ID; $(_id).popover('hide');}
        var arrayStr = data[0].split('_');
        console.log("Array is ", arrayStr);
        if(arrayStr[1].length == 2){if(this.state.IdMore){var _idMore = "#" + this.state.IdMore; $(_idMore).popover('hide');}}
        $("#comment").val(data[6]);
        $("#fromTime").val(data[4]);
        $("#toTime").val(data[5]);
        $("#leaveType").val(data[8]);
        this.setState({employeeID: data[1],fromDateState:data[2],toDateState:data[3],leaveTypeIdState:data[8],leaveTypeState:data[9],ID:data[0],fromTime:data[4],toTime:data[5], action:'edit'});
        var ID = data[0];
        ID = '#' + ID;
        var $dropdown = $(ID);
            window.callEdit = this.onClickEdit.bind(this);
            window.callDelete = this.onDelete.bind(this);
            $dropdown.popover({
                placement:'auto right',
                html:true,
                title:'<span class="text-info"><strong>' + data[7] + '</strong></span>'+
                '<button type="button" id="close" class="close" onclick="">&times;</button>'
                ,
                content:'<table class="table table-user-information">'+
                '<tbody>'+
                '<tr>'+
                '<td>Employee:</td>'+
                '<td>'+ data[7] +'</td>'+
                '</tr>'+
                '<tr>'+
                '<td>LeaveType</td>'+
                '<td>'+ data[9] +'</td>'+
                '</tr>'+
                '<tr>'+
                '<td>From</td>'+
                '<td>' + data[2] + ' ' + data[4] + '</td>'+
                '</tr>'+
                '<tr>'+
                '<td>To</td>'+
                '<td>'+ data[3] + ' ' + data[5] +'</td>'+
                '</tr>'+
                '<tr>'+
                '<td>Comment</td>'+
                '<td>' + data[6] + '</td>'+
                '</tr>'+
                '<tr>'+
                '<td><input type="button" value="Edit"  class="btn btn-primary" data-toggle="modal" data-target="#myModal" onclick="window.callEdit(\'' + data[0] + '\')"/></td>'+
                '<td><input type="button" value="Delete" class="btn btn-danger" onclick="window.callDelete(\'' + data[0] + '\')"/></td>'+
                '</tr>'+
                '</tbody>'+
                '</table>'
            });
       // }
        $dropdown.popover('show');
    }

    onMouseOverMore(_assignInMonth, ID){
        if(this.state.IdMore && this.state.IdMore != ID){var _idMore = "#" + this.state.IdMore; $(_idMore).popover('hide');}
        if(this.state.ID){var _id = "#" + this.state.ID; $(_id).popover('hide');}
        var content = '<table class="table table-user-information"><tbody>';
        console.log("assign id " + _assignInMonth[0].ID);
        for(var i = 0; i < _assignInMonth.length;i++){                                                                                                                                                                                                  //assign.ID, assign.date, assign.fromDate, assign.toDate, assign.fromTime, assign.toTime, assign.comment, assign.user, assign.leaveTypeId, assign.leaveType
            content  = content + '<tr><td><span  id="'+ _assignInMonth[i].ID + i +'" onMouseOver = "window.onRightMouseFunction(\'' + _assignInMonth[i].ID + i +'*'+ _assignInMonth[i].date  +'*'+ _assignInMonth[i].fromDate  +'*'+ _assignInMonth[i].toDate  +'*'+ _assignInMonth[i].fromTime  +'*'+ _assignInMonth[i].toTime  +'*'+ _assignInMonth[i].comment  +' *'+ _assignInMonth[i].user  +'*'+ _assignInMonth[i].leaveTypeId  +'*'+ _assignInMonth[i].leaveType + '\')"  class="label label-primary col-sm-12 col-sm-offset-0">'+ _assignInMonth[i].user+' ( '+ _assignInMonth[i].leaveType+' ) ' +'</span></td></tr>'
        }
        content = content + '</tbody></table>'
        this.setState({IdMore:ID});
        var $dropdown = $("#" + ID);
        if (!this.popoverListItem[ID]) {
            this.popoverListItem[ID] = true;
            window.onRightMouseFunction = this.onRightMouse.bind(this);
            $dropdown.popover({
                placement:'auto right',
                html:true,
                title:'<span class="text-info"><strong>' + 'List Leave Assign' + '</strong></span>'+
                '<button type="button" id="close" class="close">&times;</button>'
                ,
                content:content
            });
        }
        $dropdown.popover('show');
    }



    renderDay(day) {
        var that = this;
        var _assignInMonth = [];
        var date = day.getDate();
        var month = day.getMonth()+1;
        var year = day.getYear();
        if(date < 10){date = '0' + date}
        if(month < 10){month = '0' + month}
        year = '20' + year.toString().substring(1, 3);
        const _date =  month + '/' + date + '/' + year;
        for(var i=0;i<that.state._assignList1.length;i++){
            if(_date >= that.state._assignList1[i].start_date && _date <= that.state._assignList1[i].end_date){
                var _time = 'normal';
                if(_date == that.state._assignList1[i].start_date || _date == that.state._assignList1[i].end_date){_time = 'special'}
                _assignInMonth.push({date:that.state._assignList1[i].employeeId, ID:that.state._assignList1[i]._id + '_' + day.getDate(), comment:that.state._assignList1[i].text, fromDate:that.state._assignList1[i].start_date, toDate:that.state._assignList1[i].end_date, leaveTypeId: that.state._assignList1[i].leaveTypeId,leaveType: that.state._assignList1[i].leaveType, fromTime:that.state._assignList1[i].durationFrom, toTime:that.state._assignList1[i].durationTo, color:that.state._assignList1[i].color, time: _time, user:that.state._assignList1[i].user});
            }
        }


        return (
            <div>
                { day.getDate()}
                <div className="Birthdays-List">
                    {
                        _assignInMonth.map(function(assign, index){
                            if(index == 2){
                                return(<div><span  id={assign.ID} onMouseOver={that.onMouseOverMore.bind(that, _assignInMonth, assign.ID)}  style={{color: 'white',background:'#336699',border:'none'}} className="label label-large font col-sm-12 col-sm-offset-0" > + {_assignInMonth.length - 2} more</span></div>)
                            }else if(index < 2) {
                                var str = assign.ID + '*' + assign.date + '*' + assign.fromDate + '*' + assign.toDate + '*' + assign.fromTime+ '*' + assign.toTime+ '*' + assign.comment+ ' *' + assign.user+ '*' + assign.leaveTypeId+ '*' + assign.leaveType;
                                if (that.state.userName) {
                                    if(assign.time == 'special'){
                                        if(assign.fromTime == 'Morning' && assign.toTime == 'Afternoon' && _date == assign.fromDate && _date == assign.toDate){
                                            return (<div><span  id={assign.ID} onMouseOver={that.onRightMouse.bind(that, str)} style={that.active(assign.color)} className="label label-large font col-sm-12 col-sm-offset-0"> </span><br></br></div>)
                                        } else if(assign.fromTime == 'Morning' && _date == assign.fromDate){
                                            return (<div><span  id={assign.ID} onMouseOver={that.onRightMouse.bind(that, str)} style={that.active(assign.color)} className="label label-large font col-sm-6 col-sm-offset-0"> </span><br></br></div>)
                                        }else if(assign.fromTime == 'Afternoon' && _date == assign.fromDate){
                                            return (<div><span  id={assign.ID} onMouseOver={that.onRightMouse.bind(that, str)} style={that.active(assign.color)} className="label label-large font col-sm-6 col-sm-offset-6"> </span><br></br></div>)
                                        }else if(assign.toTime == 'Morning' && _date == assign.toDate){
                                            return (<div><span  id={assign.ID} onMouseOver={that.onRightMouse.bind(that,str)} style={that.active(assign.color)} className="label label-large font col-sm-6 col-sm-offset-0"> </span><br></br></div>)
                                        } else if(assign.toTime == 'Afternoon' && _date == assign.toDate){
                                            return (<div><span  id={assign.ID} onMouseOver={that.onRightMouse.bind(that, str)} style={that.active(assign.color)} className="label label-large font col-sm-6 col-sm-offset-6"> </span><br></br></div>)
                                        }else return (<div><span  id={assign.ID} onMouseOver={that.onRightMouse.bind(that, str)} style={that.active(assign.color)} className="label label-large font col-sm-12 col-sm-offset-0"> </span><br></br></div>)
                                    }else{
                                        return (<div><span  id={assign.ID} onMouseOver={that.onRightMouse.bind(that, str)} style={that.active(assign.color)} className="label label-default font col-sm-12 col-sm-offset-0"> </span><br></br></div>)
                                    }
                                } else{
                                    if(assign.time == 'special'){
                                        if(assign.fromTime == 'Morning' && assign.toTime == 'Afternoon' && _date == assign.fromDate && _date == assign.toDate){
                                            return (<div><span  id={assign.ID} onMouseOver={that.onRightMouse.bind(that, str)} style={that.active(assign.color)} className="label label-large font col-sm-12 col-sm-offset-0">{assign.user}({assign.leaveType})</span><br></br></div>)
                                        } else if(assign.fromTime == 'Morning' && _date == assign.fromDate){
                                            return (<div><span  id={assign.ID} onMouseOver={that.onRightMouse.bind(that,str)} style={that.active(assign.color)} className="label label-large font col-sm-6 col-sm-offset-0">{assign.user}({assign.leaveType})</span><br></br></div>)
                                        }else if(assign.fromTime == 'Afternoon' && _date == assign.fromDate){
                                            return (<div><span  id={assign.ID} onMouseOver={that.onRightMouse.bind(that, str)} style={that.active(assign.color)} className="label label-large font col-sm-6 col-sm-offset-6">{assign.user}({assign.leaveType})</span><br></br></div>)
                                        }else if(assign.toTime == 'Morning' && _date == assign.toDate){
                                            return (<div><span  id={assign.ID} onMouseOver={that.onRightMouse.bind(that, str)} style={that.active(assign.color)} className="label label-large font col-sm-6 col-sm-offset-0">{assign.user}({assign.leaveType})</span><br></br></div>)
                                        } else if(assign.toTime == 'Afternoon' && _date == assign.toDate){
                                            return (<div><span  id={assign.ID} onMouseOver={that.onRightMouse.bind(that, str)} style={that.active(assign.color)} className="label label-large font col-sm-6 col-sm-offset-6">{assign.user}({assign.leaveType})</span><br></br></div>)
                                        }else return (<div><span  id={assign.ID} onMouseOver={that.onRightMouse.bind(that, str)} style={that.active(assign.color)} className="label label-large font col-sm-12 col-sm-offset-0">{assign.user}({assign.leaveType})</span><br></br></div>)
                                    }else
                                        return(<div>
                                            <span  id={assign.ID} onMouseOver={that.onRightMouse.bind(that, str)}  style={that.active(assign.color)} className="label label-large font has-popover col-sm-12 col-sm-offset-0">{assign.user}({assign.leaveType})</span><br></br>
                                        </div>)
                                }
                            }else if(index > 2){}
                        }, that)
                        }
                </div>
            </div>
        );
    }
});
