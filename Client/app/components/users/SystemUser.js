import React from 'react';
import UserActions from '../../actions/UserActions';
import Router from 'react-router';
import UserStore from '../../stores/UserStore';
import AuthenticatedComponent from '../AuthenticatedComponent';
import EmployeeStore from '../../stores/EmployeeStore';
import EmployeeAction from '../../actions/EmployeeActions';
import RouterContainer from '../../helper/RouterContainer';
import Griddle from 'griddle-react';
import columnMeta from '../../utils/griddle/GriddleUser';
import Breadcumb from '../Breadcumb';
import Permission,{checkHeader,checkFunction} from '../roles/Permission.js';
import LoginStore from '../../stores/LoginStore.js';
var Link = Router.Link;
export default AuthenticatedComponent(class LoadUser extends React.Component {
  constructor() {
    super()
    this.state = {users: [],ListEmployee: []}
    this._arrUserForDel = []
      this._roles = [];
  }

  componentWillMount(){
        this._roles = LoginStore.role
        if(!checkHeader(this._roles,'0')){
            RouterContainer.get().replaceWith('/error')
        }
  }
    hideFunction(){
        $("#addUser").hide()
        $("#delete").hide()
    }

  getEmployees() {
    return {ListEmployee: EmployeeStore.getEmployeeList()}
  }
  getUserItems() {
    let _customUsers= UserStore.users;
    for (var i = 0; i < _customUsers.length; i++) {
      _customUsers[i].employeeName=this.getEmployeeName(_customUsers[i].employeeId)
      _customUsers[i].password= this.getNumnerStart(_customUsers[i].password.length)
    }
    return {users: _customUsers}
  }
  getNumnerStart(num){
    let start=''
    for (var i = 0; i < num; i++) {
     start+='*'
    }
    return start
  }
  getEmployeeName(employeeId){
    let _listEmployee=this.state.ListEmployee
    for (var i = 0; i < _listEmployee.length; i++) {
      if(_listEmployee[i].employeeId==employeeId)
        return _listEmployee[i].firstName+' '+_listEmployee[i].lastName
     
    };
     return ''
  }
  componentDidMount() {
    UserStore.addChangeListener(this._onChange.bind(this))
    var that = this
   
    EmployeeAction.getEmployee(function() {
      that.setState(that.getEmployees())
       UserActions.getUsers(function() {
      that.setState(that.getUserItems())
    })
    })
      var _roles = LoginStore.role
      this.hideFunction();
      if(checkFunction(_roles, '8', '2') == true){
          $("#addUser").show()
          $("#delete").show()
      }
  }
  resetCheckbox() {
    var rmvUser = document.getElementsByName('checkdel')
    for (var i = 0; i < rmvUser.length; i++) {
      rmvUser[i].checked = false
    }
  }
  _onChange() {
    var that = this
    UserActions.getUsers(function() {
      that.setState(that.getUserItems())
    })
  }
  checkSelected(rmvUser) {
    var count = 0
    for (var i = 0; i < rmvUser.length; i++) {
      if (rmvUser[i].checked) {
        count++
      }
    }
    return count
  }
  handleRemoveClick(e) {
    e.preventDefault()
    var that = this
    var rmvUser=$("input[name=checkdel]")
    if (this.checkSelected(rmvUser) > 0) {
       bootbox.confirm("Are you sure want to permanently delete these records?", function(result){
         if (result) {
             $("input[name=checkdel]").each(function(idx) {
                if (($(this).is(':checked'))) 
              UserActions.removeUser(rmvUser[idx].value, that.resetCheckbox.bind(that))
             })
         }
       })
    }
}
  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="rows">
          <Breadcumb dataUri={[{'link':'home','name':'Home'}]} activeName="User Management" />
          </div>
          <div className="rows">
            <div className="name-page">User Management</div>
            <div className="panel">
                <div className="panel-heading sc-panel-heading">
                  <div className="row"> 
                      <Link to="add-system-user">
                        <button className="btn btncreative btn-5 btn-5b icon-plus sc-btn-align-panel-heading" id="addUser"><span>Add New</span></button>
                      </Link>
                      <button className="btn btncreative btn-5 btn-5a icon-remove sc-btn-align-panel-heading" id="delete" onClick={ this.handleRemoveClick.bind( this )}><span>Delete</span></button>
                  </div>
                </div>
                <div id="showTable">
                <Griddle
                         useGriddleStyles={false}
                         enableToggleCustom={true}
                         results={this.state.users}
                         tableClassName="table"
                         showFilter={true}
                         columnMetadata={columnMeta}
                         showSettings={true}
                         nextIconComponent=<i className="fa fa-long-arrow-right" style={{marginLeft:"8px"}}></i>
                         previousIconComponent=<i className="fa fa-long-arrow-left" style={{marginRight:"8px"}}></i>
                         columns={ [ "username", "password", "status", "_id",  "__v", "employeeName","accType" ]}/>
                </div>
              </div>
            </div>
        </div>
      </div>
    );
  }
});