import React from 'react';
import Router from 'react-router';
import LeaveActions from '../../actions/LeaveActions.js';
import LeaveStore from '../../stores/LeaveStore.js';
import AuthenticatedComponent from '../AuthenticatedComponent';
import EmployeeAction from '../../actions/EmployeeActions';
import EmployeeStore from '../../stores/EmployeeStore';
import RouterContainer from '../../helper/RouterContainer';
import LoginStore from '../../stores/LoginStore.js';
import Permission,{checkFunction ,checkHeader} from '../roles/Permission.js';
import Select from 'react-select';
import Breadcumb from '../Breadcumb';
var Link = Router.Link;

export default  AuthenticatedComponent(class EditLeaveEntitlement extends React.Component
{

    constructor()
    {
        super();
        this.state={listEmployees:[],listTypes:[], _listLeaveType:[], listPeriods:[],employeeId:"",leaveType:"",leaveTypeName:"",leaveTypeColor:"",entitlementDay:"",leavePeriod:""};
    }
    getEmployees()
    {
        return {listEmployees:EmployeeStore.getEmployeeList()};
    }

    getPeriods()
    {
        return {listPeriods:LeaveStore.getAllPeriod()};
    }
    componentWillMount()
    {
        var that=this
        var _roles = LoginStore.role
        var id = this.props.params._id
        if(checkFunction(_roles,'5','2') == false){
            RouterContainer.get().replaceWith('/error')
        }

        LeaveActions.getEntitleById(id,function(){
            var entitle = LeaveStore.getEntitle();
            EmployeeAction.getAnEmployee(entitle.employee.employee_id,function(data){
                $('#employee').val(data.firstName + ' '+ data.lastName)
                that.setState({employeeId:entitle.employee.employee_id})
                $('#employee').prop('disabled',true);
                $('#leaveType').prop('disabled',true);
                LeaveActions.getLeaveTypeByEmployee(entitle.employee.employee_id, function(){
                    that.setState({_listLeaveType:LeaveStore.getLeaveTypeEm()});
                    console.log('data: '+entitle.leaveType.leavetype_id+' '+entitle.leavePeriodId)
                    $('#leaveType').val(entitle.leaveType.leavetype_id)
                    that.setState({leaveType:entitle.leaveType.leavetype_id})
                    that.state._listLeaveType.map(function(data){
                        if(data._id == entitle.leaveType.leavetype_id)
                        {
                            that.state.leaveTypeName=data.leaveType;
                            that.state.leaveTypeColor = data.color;
                        }
                    });
                    $('#leavePeriod').val(entitle.leavePeriodId)
                    $('#entitlementDay').val(entitle.entitlementDay)
                });
            })
        })
        LeaveActions.getAllDataLeavePeriod(function(){
            that.setState(that.getPeriods());
        });
    }
    handleLeaveType(e)
    {
        this.onFocus();
        var that=this;
        this.state.leaveType=e.target.value;
        this.state._listLeaveType.map(function(data){
            if(data._id == e.target.value)
            {
                that.state.leaveTypeName=data.leaveType;
                that.state.leaveTypeColor = data.color;
            }
        });
    }
    handleLeavePeriod(e)
    {
        this.onFocus();
        this.state.leavePeriod= e.target.value;
    }
    handleEntitlements(e)
    {
        this.onFocus();
        this.state.entitlementDay=e.target.value;
    }
    handleSubmit(e){
        e.preventDefault();
        var employeeId=this.state.employeeId;
        var entitlementDay=$('#entitlementDay').val()
        var leaveType=this.state.leaveType;
        var leavePeriod=$('#leavePeriod').val()
        if(employeeId == "" || isNaN(parseInt(entitlementDay)) == true || leaveType == "" || leavePeriod == "")
        {
            if(employeeId == "")
            {
                $('#errorEmployee').html('Employee is required');
            }
            if(isNaN(parseInt(entitlementDay)) == true)
            {
                $('#errorEntilementDay').html('Should be a number');
            }
            if(leaveType == "")
            {
                $('#errorLeaveType').html('LeaveType is required');
            }
            if(leavePeriod == "")
            {
                $('#errorLeavePeriod').html('LeavePeriod is required');
            }
        }
        else
        {
            var entitlement={employeeId:employeeId,leaveTypeId:leaveType,entitlementDay:entitlementDay,leavePeriodId:leavePeriod,leaveTypeName:this.state.leaveTypeName,leaveTypeColor:this.state.leaveTypeColor};
            LeaveActions.checkEntitle(entitlement,function(){
                var mess = LeaveStore.getMsg();
                if(mess.message){
                    $('#errorAdd').html('This entitlement assign existed');
                }
                if(mess.success){
                    LeaveActions.addLeaveEntitlement(entitlement,function(){
                        var message=LeaveStore.getMessageAddLeaveEntitlement();
                        $('#successAdd').html(message.message);
                    });
                }
            })
        }

    }
    onFocus()
    {
        $('#errorEmployee').html('');
        $('#errorEntilementDay').html('');
        $('#errorLeaveType').html('');
        $('#errorLeavePeriod').html('');
        $('#errorAdd').html('');
    }
    render()
    {
        var options = [];
        this.state.listEmployees.map(function(emp){
            var label=emp.firstName + " " + emp.lastName;
            options.push({value:emp.employeeId,label:label})
        });
        var _listLeaveType=this.state._listLeaveType.map(function(data){
            return (<option value={data._id}>{data.leaveType}</option>)
        });
        var listPeriods=this.state.listPeriods.map(function(data){
            return (<option value={data._id}> {data.start.substring(0,10) + " - " + data.end.substring(0,10)} </option>)
        });
        return (
            <div>
                <div className="container-fluid">
                    <div className="rows">
                        <Breadcumb dataUri={[{'link':'home','name':'Home'},{'link':'manage-entitle','name':'Employee Entitlement'}]} activeName="Add Entitlement" />
                    </div>
                    <div className="rows">
                        <div className="name-page">Add Leave Entitlements</div>
                        <div className="panel">
                            <div className="panel-body">
                                <form>
                                    <p className = "successForm" id="successAdd"></p>
                                    <span className="errorValidation" id="errorAdd"></span>
                                    <div className = "row">
                                        <div className="col-sm-4 form-group">
                                            <label for="exampleInputEmail1">Employee</label>
                                            <input id="employee" className="form-control" type="text" />
                                        </div>
                                    </div>
                                    <div className="row form-group">
                                        <div className="col-sm-4">
                                            <label for="exampleInputEmail1">Leave Types</label>
                                            <select id = "leaveType" onChange={this.handleLeaveType.bind(this)} className="form-control">
                                                <option>-- select --</option>
                            {_listLeaveType}
                                            </select>
                                            <span className="errorValidation" id="errorLeaveType"></span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4 form-group">
                                            <label for="exampleInputEmail1">Leave Period</label>
                                            <select id = "leavePeriod"onChange={this.handleLeavePeriod.bind(this)} className="form-control">
                                                <option>-- select --</option>
                        {listPeriods}
                                            </select>
                                            <span className="errorValidation" id="errorLeavePeriod"></span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4 form-group">
                                            <label for="exampleInputEmail1">Entitlements(days)</label>
                                            <input id="entitlementDay" onChange={this.handleEntitlements.bind(this)} className="form-control" type="number" />
                                            <span className="errorValidation" id="errorEntilementDay"></span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4"><label for="exampleInputEmail1">Entitlement Type: </label>(Added)</div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-sm-4">
                                            <button className="btn sc-btn-green" onClick={this.handleSubmit.bind(this)} type="submit">Save</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
    }
})

