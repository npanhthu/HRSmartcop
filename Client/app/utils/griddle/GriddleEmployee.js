import React from 'react';
import Router from 'react-router';
import EmployeeAction from '../../actions/EmployeeActions';
import UserActions from '../../actions/UserActions';
var Link = Router.Link;

class CheckboxComponent extends React.Component{
	render(){
     return <input type="checkbox" value={this.props.rowData.employeeId} name='checkdel' />
  }
}
class LinkEditEmployee extends React.Component{
  render(){
     return (
              <Link to='personal-details' params={{ employeeId: this.props.rowData.employeeId }}>{this.props.rowData.employeeId} (<i className="fa fa-pencil"></i>)</Link>)
  }
}

class ChangeGender extends React.Component{
  render(){
    let gender=''
    if(this.props.data==1){
      gender='Female'}
      else{
        gender='Male'
      }
      return (<div>{gender}</div>)
    }
  }

export default [
	{
    "columnName":"__v",
    "order":1,
    "locked":false,
    "visible":true,
    "displayName": "#",
    "customComponent": CheckboxComponent
  },
	{
    "columnName":"employeeId",
    "order":2,
    "locked":false,
    "visible":true,
    "displayName": "Id",
    "customComponent": LinkEditEmployee
  },
  {
    "columnName": "firstName",
    "displayName":"FirstName",
    "order":3,
    "locked":false,
    "visible":true,
  },
  {
    "columnName":"lastName",
    "displayName":"LastName",
    "order":4,
    "locked":false,
    "visible":true
  },
  {
    "columnName": "leaveBalance",
    "displayName": "Balance Days",
    "order":5,
    "locked":false,
    "visible":true,
    
  },
   {
    "columnName": "locationName",
    "displayName": "Location",
    "order":6,
    "locked":false,
    "visible":true,
  },
   {
    "columnName": "DLNumber",
    "visible":false,
  },
   {
    "columnName": "nationalityName",
    "displayName": "Nationality",
    "order":7,
    "locked":false,
    "visible":true,
  },
  {
    "columnName": "gender",
    "displayName": "Gender",
    "order":8,
    "locked":false,
    "visible":true,
    "customComponent": ChangeGender
  },
  {
    "columnName":"nickName",
    "visible":false,
  },
  {
    "columnName":"_id",
    "visible":false,
  },
   {
    "columnName":"isArchive",
    "visible":false,
  },
   {
    "columnName":"licenseExpiryData",
    "visible":false,
  },
  {
    "columnName":"maritalStatus",
    "visible":false,
  },
  {
    "columnName":"location",
    "visible":false,
  },
  {
    "columnName":"imageUpload",
    "visible":false,
  }
]