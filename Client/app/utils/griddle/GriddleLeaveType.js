import React from 'react';
import Router,{Link} from 'react-router';
class CheckboxComponent extends React.Component{
  render(){
   return (<input type="checkbox" value={this.props.data} name='checkdel' />)
 }
}
class LinkEditType extends React.Component{
  render(){
   return (<Link to="edit-leave-type" params={{ identity: this.props.rowData._id }}> {this.props.data}(<i className="fa fa-pencil"></i>)</Link>)
 }
}
export default [
  {
    "columnName": "_id",
    "displayName": "#",
    "order": 1,
    "locked": false,
    "visible": true,
    "customComponent": CheckboxComponent
  },
  {
    "columnName": "leaveType",
    "order": 2,
    "locked": false,
    "visible": true,
    "displayName":"Leave Type",
    "customComponent": LinkEditType
  },
  {
    "columnName": "countryName",
    "order": 3,
    "locked": false,
    "visible": true,
    "displayName":"Country"
    
  },
  {
    "columnName": "__v",
    "visible": false
    
  },
  {
    "columnName": "country",
    "visible": false
    
  }
]
