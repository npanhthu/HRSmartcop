import React from 'react';
import Router from 'react-router';
var Link = Router.Link;
class CheckboxComponent extends React.Component {
    render() {
        if (this.props.rowData.name == "Default Ess" || this.props.rowData.name == "Default Supervisor") {
            return <div></div>
        }
        else{
                return <input type="checkbox" value={this.props.rowData._id} name='checkdel' />
            }

    }
}
class LinkEditUserRole extends React.Component{
  render(){
     return (<Link to="edit-role" params={{role_id:this.props.rowData._id}}>{this.props.rowData.name}(<i className="fa fa-pencil"></i>)</Link> )
  }
}
class UserRoleType extends React.Component{
  render(){
     return (<div>{this.props.rowData.type.nameType}</div>)
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
    "columnName": "name",
    "displayName":"User Role ",
    "order":2,
    "locked":false,
    "visible":true,
    "customComponent": LinkEditUserRole
  },
  {
    "columnName":"type",
    "displayName":"User Role Type",
    "order":3,
    "locked":false,
    "visible":true,
    "customComponent":UserRoleType
  }
]