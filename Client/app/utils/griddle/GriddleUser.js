import React from 'react';
import Router from 'react-router';
import EmployeeAction from '../../actions/EmployeeActions';
import UserActions from '../../actions/UserActions';
var Link = Router.Link;

class CheckboxComponent extends React.Component{
	render(){
     return <input type="checkbox" value={this.props.rowData._id} name='checkdel' />
  }
}
class LinkEditUser extends React.Component{
  render(){
     return (<Link to='edit-system-user' params={{ user: this.props.rowData._id }}>{this.props.rowData.username}</Link>)
  }
}
class EmployeeName extends React.Component{
 
  render(){
    
    return (<div>{this.props.data}</div>)
  }
}
class Status extends React.Component{
  
  render(){
    let status=''
    var colorGreen={color:"green"};
  var colorRed={color:"red"};
    if(this.props.data==1){
      status=<i style={colorGreen} className="fa fa-lightbulb-o"></i>
    }else{
      status=<i style={colorRed} className="fa fa-lightbulb-o"></i>
    }
    return (<div style={{textAlign:'center'}}>{status}</div>)
  }
}
class DisableUser extends React.Component{
  disableUser(data) {
    bootbox.confirm("Are you sure want to permanently disable this user?", function(valid) {
      if (valid) {
        UserActions.disableUser(data,null);
      }
    });
  }
  render(){
      console.log('status: '+this.props.rowData.status)
      if(this.props.rowData.status==1){
          return (<div onClick={this.disableUser.bind(this, this.props.rowData.username)} className="cursor">Disable this user</div>)
      }
      if(this.props.rowData.status==0){
          return (<div>Disable this user</div>)
      }
  }
}
class AccountType extends React.Component{
  render()
  {
    let accType='';
    var colorGreen={color:'green'};
    if (this.props.rowData.accType == 1) {
      accType=<span style={colorGreen}>Smartdev</span>;
    }
    else
    {
      accType=<span>Regular</span>
    }
    return (<div>{accType}</div>);
  }
}
export default [
	{
    "columnName":"_id",
    "order":1,
    "locked":false,
    "visible":true,
    "displayName": "#",
    "customComponent": CheckboxComponent
  },
  {
    "columnName": "username",
    "displayName":"Username",
    "order":2,
    "locked":false,
    "visible":true,
    "customComponent": LinkEditUser
  },
  {
    "columnName":"password",
    "displayName":"Password",
    "order":3,
    "locked":false,
    "visible":true
  },
   {
    "columnName": "employeeName",
    "displayName": "Employee Name",
    "order":5,
    "locked":false,
    "visible":true,
    "customComponent": EmployeeName
  },
   {
    "columnName": "status",
    "displayName": "Status",
    "order":6,
    "locked":false,
    "visible":true,
    "customComponent": Status
  },
  {
    "columnName":"__v",
    "displayName":"Disable User",
    "order":7,
    "locked":false,
    "visible":true,
    "customComponent": DisableUser
  },
  {
    "columnName":"employeeId",
    "displayName":"Disable User",
    "order":7,
    "locked":true,
    "visible":false,
    "customComponent": DisableUser
  },
  {
    "columnName":"accType",
    "displayName":"Account Type",
    "order":8,
    "locked":false,
    "visible":true,
    "customComponent":AccountType
  }
]