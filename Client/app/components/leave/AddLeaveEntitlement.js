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

export default  AuthenticatedComponent(class AddLeaveEntitlement extends React.Component
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
  // getLeaves()
  // {
  //   return {listTypes:LeaveStore.getLeaveType()};
  // }
  getPeriods()
  {
    return {listPeriods:LeaveStore.getAllPeriod()};
  }
  getLeaveTypeByEmployees(){
    this.setState({_listLeaveType:LeaveStore.getLeaveTypeEm()})
  }
  componentWillMount()
  {
    var that=this
    var _roles = LoginStore.role
    if(checkFunction(_roles,'5','2') == false){
        RouterContainer.get().replaceWith('/error')
    }
    EmployeeAction.getEmployee( function () {
    that.setState( that.getEmployees() )
  } );
    // LeaveActions.getAll( function () {
    //     that.setState( that.getLeaves() );
    // } );
    LeaveActions.getAllDataLeavePeriod(function(){
        that.setState(that.getPeriods());
    });
  }
  handleEmployee(val)
  {
      this.onFocus();     
      this.state.employeeId=val;
      var that =this;
      LeaveActions.getLeaveTypeByEmployee(that.state.employeeId, function(){
        that.setState({_listLeaveType:LeaveStore.getLeaveTypeEm()});        
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
    var entitlementDay=this.state.entitlementDay;
    var leaveType=this.state.leaveType;
    var leavePeriod=this.state.leavePeriod;
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
      var entitlement={employeeId:this.state.employeeId,leaveTypeId:this.state.leaveType,entitlementDay:this.state.entitlementDay,leavePeriodId:this.state.leavePeriod,leaveTypeName:this.state.leaveTypeName,leaveTypeColor:this.state.leaveTypeColor};
      LeaveActions.checkLeaveType(entitlement,function(){
          var msg = LeaveStore.getMsg();
          if(msg.message){
              $('#errorAdd').html('Employee has assigned this leavetype');
          }
          if(msg.success){
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
    var _selects=(<Select onChange={this.handleEmployee.bind(this)}
        name="form-field-name"
        value={this.state.employeeId}
        options={options} />);
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
                           {_selects}
                           <span className="errorValidation" id="errorEmployee"></span>
                      </div>
                  </div>
                  <div className="row form-group">
                      <div className="col-sm-4">
                         <label for="exampleInputEmail1">Leave Types</label>
                         <select onChange={this.handleLeaveType.bind(this)} className="form-control">
                            <option>-- select --</option>
                            {_listLeaveType}
                        </select>
                        <span className="errorValidation" id="errorLeaveType"></span>
                      </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-4 form-group">
                        <label for="exampleInputEmail1">Leave Period</label>
                        <select onChange={this.handleLeavePeriod.bind(this)} className="form-control">
                         <option>-- select --</option>
                        {listPeriods}
                        </select>
                         <span className="errorValidation" id="errorLeavePeriod"></span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-4 form-group">
                          <label for="exampleInputEmail1">Entitlements(days)</label>
                          <input id="entilementDay" onChange={this.handleEntitlements.bind(this)} className="form-control" type="number" />
                          <span className="errorValidation" id="errorEntilementDay"></span>
                    </div>
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
}
)
