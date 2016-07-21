import $ from 'jquery';
import React from 'react';
import LeaveActions from '../../actions/LeaveActions.js';
import LeaveStore from '../../stores/LeaveStore';
import EmployeeStore from '../../stores/EmployeeStore';
import AuthenticatedComponent from '../AuthenticatedComponent';
import Router from 'react-router';
import columnMeta, { getNumOfDays } from '../../utils/griddle/GriddleLeave';
import EmployeeAction from '../../actions/EmployeeActions';
import LoginStore from '../../stores/LoginStore.js';
import Permission,{checkFunction} from '../roles/Permission.js';
import RouterContainer from '../../helper/RouterContainer';
import Griddle from 'griddle-react';
import Breadcumb from '../Breadcumb';
import _    from 'lodash';
import Select from 'react-select';
var Link = Router.Link;
export default AuthenticatedComponent( class LeaveList extends React . Component
{
    constructor() {
        super();
        this.state = {
            assignList: [],
            employeeList: []
        }
    }
    componentWillMount(){
        var _roles = LoginStore.role
        console.log("roles ",_roles);
         if (checkFunction(_roles,'4','2') == false || checkFunction(_roles,'4','1')== false) {
             RouterContainer.get().replaceWith('/error')
         }
    }

    componentDidMount() {
        this.loadData()
        LeaveStore.addChangeListener(this.loadData.bind(this))
    }
    loadData() {
        let that = this
        EmployeeAction.getEmployee( function () {
            that.setState( { employeeList: EmployeeStore.getEmployeeList() } )
            LeaveActions.getListAssign( function () {
                that.setState({assignList: that.getDataAssigns()}  )
            } )
        } )
        setTimeout(function(){
            let data = getNumOfDays();
            setTimeout(function(){
                LeaveActions.saveNumberOfDay(data)
            },2000)
        },2000)
    }
    getDataAssigns() {
        let _custAssigList = LeaveStore.assignList
        for (var i = 0; i < _custAssigList.length; i++) {
            _custAssigList[ i ].employeeName = this.getEmployeeName( _custAssigList[ i ].employeeId )
            _custAssigList[ i ].statusName = this.getStatusName( _custAssigList[ i ].status )
            _custAssigList[i].leaveBalance = this.getleveBalance(_custAssigList[i].employeeId)
            _custAssigList[ i ].location = this.getLocation( _custAssigList[ i ].employeeId )
        }
        return  _custAssigList
    }
    getStatusName( status ) {
        switch (status) {
            case 0:
                return 'Pending Approval'
            case 1:
                return 'Scheduled'
            case 2:
                return 'Rejected'
            case 3:
                return 'Canceled'
            case 4:
                return 'Taken'
            default:
                return ''
        }
    }
    getLocation(employeeId){
        let _listEmployee = this.state.employeeList
        for (var i = 0; i < _listEmployee.length; i++) {
            if ( _listEmployee[ i ].employeeId == employeeId ){
                return _listEmployee[ i ].location
            }
        }
        return 0
    }
    getEmployeeName( employeeId ) {
        let _listEmployee = this.state.employeeList
        for (var i = 0; i < _listEmployee.length; i++) {
            if ( _listEmployee[ i ].employeeId == employeeId )
                return _listEmployee[ i ].firstName + ' ' + _listEmployee[ i ].lastName
        }
        return employeeId
    }
// Leave List
    getleveBalance(employeeId){
        let _listEmployee = this.state.employeeList
        for (var i = 0; i < _listEmployee.length; i++) {
            if ( _listEmployee[ i ].employeeId == employeeId ){
                return _listEmployee[ i ].leaveBalance
            }

        }
        return 0
    }
    handlerClickSave( e ) {

        LeaveActions.upDateAssign( _objData)
    }
    handleChangeValue(e)
    {
      let val = e.target.value
        if(val === '0'){
            this.state.assignList = this.getDataAssigns()
            this.setState(this.state)
        }
        else{
            if(val<10){
                val='0'+val
            }
            let today = new Date()
            let yyyy = today.getFullYear();
            let _custAssigList = _.filter(this.getDataAssigns(), function(obj) {
                                        return obj.start_date.indexOf(val+'/') > -1 && obj.start_date.indexOf(yyyy) > -1
                                })
            this.state.assignList = _custAssigList
            this.setState(this.state)
        }
    }
    render() {
        // var options = [];
        // for (var i = 1; i <= 12; i++) {
        //     var temp = i+''
        //     options.push({value:temp,label:temp})
        // };
        // var _selects=(<Select onChange={this.handleChangeValue.bind(this)}
        // name="month"
        // options={options} placeholder="Chosse month to filter" className="choose-month-filter" valueRenderer={this.handleVaueRenderer.bind(this)} />);
        return (
            <div>
                <div className="container-fluid">
                    <div className="rows">
                        <Breadcumb dataUri={ [ { 'link': 'home', 'name': 'Home' } ]} activeName="Leave List" />
                    </div>
                    <div className="rows">
                        <div className="name-page">Leave List</div>
                    </div>
                        <div id="chooseass" className="rows">
                            &nbsp;&nbsp;Chosse month to filter: <select onChange={this.handleChangeValue.bind(this)} className="choose-month-filter">
                                <option value="0">Show All Month</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                            </select></div>
                      <div className="rows">  
                        <div id='showTable'>
                            <Griddle
                                useGriddleStyles={false}
                                enableToggleCustom={true}
                                results={this.state.assignList}
                                tableClassName="table"
                                showFilter={true}
                                columnMetadata={columnMeta}
                                showSettings={true}
                                nextIconComponent=<i className="fa fa-long-arrow-right" style={{marginLeft:"8px"}}></i>
                            previousIconComponent=<i className="fa fa-long-arrow-left" style={{marginRight:"8px"}}></i>
                            columns={ [ "employeeName","user", "leaveTypeId", "start_date", "end_date", "leaveBalance", "__v", "statusName" ]}/>
                        </div>
                    </div>
                </div>
            </div>)
    }
    } );