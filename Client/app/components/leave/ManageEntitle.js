import React from 'react';
import Router from 'react-router';
import Autosuggest from 'react-autosuggest';
import EmployeeAction from '../../actions/EmployeeActions';
import EmployeeStore from '../../stores/EmployeeStore';
import LeaveActions from '../../actions/LeaveActions.js'
import LeaveStore from '../../stores/LeaveStore.js';
import RouterContainer from '../../helper/RouterContainer';
import AuthenticatedComponent from '../AuthenticatedComponent';
import columnMeta from '../../utils/griddle/GriddleLeaveEntitle.js';
import LoginStore from '../../stores/LoginStore.js';
import Permission,{checkFunction,checkHeader} from '../roles/Permission.js';
import Breadcumb from '../Breadcumb';
import Griddle from 'griddle-react';
import Select from 'react-select';
var Link = Router.Link;
export default AuthenticatedComponent (class AddTypeLeave extends React . Component {
    constructor() {
        super();
        this.state = {
            leavetypes: [], entitles : [], listEmployees: [], employeeId : "",listPeriods:[]};
    }
    getEmployees(){
        return {listEmployees:EmployeeStore.getEmployeeList()};
    }
    getLeaveType() {
        return { leavetypes: LeaveStore.getLeaveType() };
    }

    getEntitle() {
        var customEntitle = LeaveStore.getEntitle();
        var emp = LeaveStore.getAllPeriod()
        for(var i=0;i<customEntitle.length;i++){
            for(var j=0;j<emp.length;j++){
                if(customEntitle[i].leavePeriodId==emp[j]._id){
                    customEntitle[i].leavePeriodId = ''
                    customEntitle[i].leavePeriodId = emp[j].start.substring(0,10) + '//'
                    + emp[j].end.substring(0,10)
                }
            }
        }
        return { entitles: customEntitle};
    }
    getPeriods()
    {
        return {listPeriods:LeaveStore.getAllPeriod()};
    }
    componentWillMount(){
        var _roles = LoginStore.role
        if(checkFunction(_roles,'5','1') == false){
            RouterContainer.get().replaceWith('/error')
        }
    }
    componentDidMount() {
        var that = this;

        EmployeeAction.getEmployee( function () {
            that.setState( that.getEmployees() )
        } );
        LeaveActions.getAll( function () {
            that.setState( that.getLeaveType() );
        } );
        LeaveActions.getAllDataLeavePeriod(function(){
            that.setState(that.getPeriods());
        });
        LeaveStore.addChangeListener( this._onChange.bind( this ) );
    }
    handleEmployee(val){
        $('#errorValidate').html('');
        this.state.employeeId = val;
    }
    handleSearch(e) {
        e.preventDefault();
        var name =  this.state.employeeId;
        if (name == "") {
            document.getElementById('errorValidate').innerHTML = 'Please input employee name';
        }
        else {
            var that = this;
            var id = $('#LeaveTypes option:selected').prop('id');
            if(id=="All"){
                LeaveActions.getAllEntitle(name, function () {
                    that.setState( that.getEntitle() );
                } );
            }
            else{
                LeaveActions.getEntitle(id,name,function(){
                    that.setState( that.getEntitle() );
                });
            }
        }
    }
    checkSelected( listDelete ) {
        var count = 0;
        for (var i = 0; i < listDelete.length; i++) {
            if ( listDelete[ i ].checked ) {
                count++
            }
        }
        return count;
    }
    resetCheckbox() {
        var listDelete = document.getElementsByName( 'checkdel' );
        for (var i = 0; i < listDelete.length; i++) {
            listDelete[ i ].checked = false
        }
    }
    handleDelete() {
        var that = this;
        var listDelete = document.getElementsByName( 'checkdel' );
        if ( this.checkSelected( listDelete ) > 0 ) {
            bootbox.confirm( "Are you sure you want to permanently delete these records?", function ( result ) {
                if ( result ) {
                    for (var i = 0; i < listDelete.length; i++) {
                        if ( listDelete[ i ].checked )
                            LeaveActions.removeLeaveEntitle( listDelete[ i ].value, that.resetCheckbox.bind( that ) )
                    }

                }

            } )
        }
    }
    _onChange(){
        var that = this;
        var name  = this.state.employeeId;
        var id = $('#LeaveTypes option:selected').prop('id');
        if(id=="All"){
            LeaveActions.getAllEntitle(name, function () {
                that.setState( that.getEntitle() );

            } );
        }
        else{
            LeaveActions.getEntitle(id,name,function(){
                that.setState( that.getEntitle() );
            });
        }
    }
    render() {
        var leavetypes = this.state.leavetypes.map( function ( leavetype, index ) {
            var leaveType = leavetype;
            return (
                <option value= {leaveType.leaveType} id= {leaveType._id} >{leaveType.leaveType}</option>
            );
        } );
        var options = [];
        this.state.listEmployees.map(function(emp){
            var label=emp.firstName + " " + emp.lastName;
            options.push({value:emp._id,label:label})
        });
        var _selects=(<Select onChange={this.handleEmployee.bind(this)}  placehoder = "Select employee" id = "emp" options={options} />);
        return (
            <div className="container-fluid">
                <div className="rows">
                    <Breadcumb dataUri={[{'link':'home','name':'Home'}]} activeName="Manage Entitlements" />
                </div>
                <div className="name-page">Management Entitlements</div>
                <div className="panel">
                    <div className="panel-body">
                        <form>
                            <p className="successForm" id="messageResult1"></p>
                            <div className="row">
                                <div className="form-group col-sm-3">
                                    <label>Employee Name *</label>
                                    {_selects}
                                    <span className="errorValidation" id="errorValidate"></span>
                                </div>
                                <div className="form-group col-sm-3">
                                    <label>Leave Types</label>
                                    <select id="LeaveTypes" className="form-control" >
                                        <option value="All" id = "All">All</option>
                                        {leavetypes}
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-sm-3">
                                    <button
                                        className="btn sc-btn-blue" type="submit" onClick = {this.handleSearch.bind(this)}>Search
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="rows">
                    <div className="panel">
                        <div className="panel-heading sc-panel-heading">
                            <div className="row">
                                <Link to="add-leave-entitlement">
                                    <button className="btn btncreative btn-5 btn-5b icon-plus sc-btn-align-panel-heading">
                                        <span>Add New</span>
                                    </button>
                                </Link>
                                <button  className="btn btncreative btn-5 btn-5a icon-remove sc-btn-align-panel-heading" onClick = {this.handleDelete.bind(this)}>
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                        <div id="showTable">
                            <Griddle
                                useGriddleStyles={false}
                                enableToggleCustom={true}
                                results={this.state.entitles}
                                tableClassName="table"
                                showFilter={true}
                                columnMetadata={columnMeta}
                                showSettings={true}
                                columns={ ["_id" ,"leaveType", "entitleType","validFrom","validTo","entitlementDay" ]}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
