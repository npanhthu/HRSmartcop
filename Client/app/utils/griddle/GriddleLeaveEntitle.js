/*** Created by ryu on 06/08/2015.*/
import React from 'react';
import Router from 'react-router';
import EmployeeAction from '../../actions/EmployeeActions';
import EmployeeStore from '../../stores/EmployeeStore';
import LeaveActions from '../../actions/LeaveActions.js'
import LeaveStore from '../../stores/LeaveStore.js';
var Link = Router.Link

class CheckboxComponent extends React.Component{
    render(){
        return <input type="checkbox" value={this.props.rowData._id} name='checkdel' />
    }
}
class entitleType extends React.Component{
    render(){
        return(<div>Added</div>)
    }
}
class validTo extends React.Component{
    render(){
        let data = this.props.rowData.leavePeriodId
        let day = data.substring(data.indexOf('//')+2,data.length)
        return(<div>{day}</div>)
    }
}
class validFrom extends React.Component{
    render(){
        let data = this.props.rowData.leavePeriodId;
        let day = data.substring(0,data.indexOf('//'))
        return(<div>{day}</div>)
    }
}
class leaveType extends React.Component{
    render(){
        let type = this.props.rowData.leaveType.name
        let id = this.props.rowData._id
        return (<Link to='edit-entitle' params={{_id: id}}>{type}</Link>)
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
        "columnName": "leaveType",
        "displayName":"LeaveTypes",
        "order":2,
        "locked":false,
        "visible":true,
        "customComponent": leaveType
    },
    {
        "columnName":"entitleType",
        "displayName":"EntitleType",
        "order":3,
        "locked":false,
        "visible":true,
        "customComponent": entitleType
    },
    {
        "columnName": "validFrom",
        "displayName": "Valid from",
        "order":4,
        "locked":false,
        "visible":true,
        "customComponent": validFrom
    },
    {
        "columnName": "validTo",
        "displayName": "Valid to",
        "order":5,
        "locked":false,
        "visible":true,
        "customComponent": validTo
    },
    {
        "columnName": "entitlementDay",
        "displayName": "Days",
        "order":6,
        "locked":false,
        "visible":true
    },
]
