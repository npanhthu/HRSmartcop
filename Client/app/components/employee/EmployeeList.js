import React from 'react';
import Router from 'react-router';
import EmployeeStore from '../../stores/EmployeeStore';
import EmployeeAction from '../../actions/EmployeeActions';
import NationalConst from '../../constants/NationalityConst';
import Griddle from 'griddle-react';
import columnMeta from '../../utils/griddle/GriddleEmployee';
import Permission,{checkFunction} from '../roles/Permission.js';
import RouterContainer from '../../helper/RouterContainer';
import LoginStore from '../../stores/LoginStore.js';
import Breadcumb from '../Breadcumb';
var Link = Router.Link;

class EmployeeList extends React . Component {
  constructor() {
    super()
    this.state = {ListEmployee: []}
  }

  getEmployees() {
    let _customEployeeList = EmployeeStore.getEmployeeList()
    for (var i = 0; i < _customEployeeList.length; i++) {
      _customEployeeList[i].locationName=this.getNameNational(_customEployeeList[i].location)
      _customEployeeList[i].nationalityName=this.getNameNational(_customEployeeList[i].nationality)
    };
    return {ListEmployee: _customEployeeList}
  }

  hideFunction(){
      $("#addEmployee").hide()
      $("#deleteEmployee").hide()
    }

  componentWillMount() {
      var _roles = LoginStore.role
      if(checkFunction(_roles,'7','1') == false){
          RouterContainer.get().replaceWith('/error')
      }
    EmployeeStore.addChangeListener(this._onChange.bind(this))
    var that = this
    EmployeeAction.getEmployee(function() {
      that.setState(that.getEmployees())
    })
  }

  componentDidMount(){
    var _roles = LoginStore.role
    this.hideFunction();
      if(checkFunction(_roles, '8', '2') == true){
          $("#addEmployee").show()
          $("#deleteEmployee").show()
      }
  }


  resetCheckbox() {
    var removeEmployee = document.getElementsByName('checkdel');
    for (var i = 0; i < removeEmployee.length; i++) {
      removeEmployee[i].checked = false;
    }
  }

  checkDelete(removeEmployee) {
    var count = 0;
    for (var i = 0; i < removeEmployee.length; i++) {
      if (removeEmployee[i].checked) {
        count++;
      }
    }
    return count;
  }

  handleRemoveClick(e) {
    e.preventDefault();
    var that = this;
    var removeEmployee = document.getElementsByName('checkdel');
      if (this.checkDelete(removeEmployee) > 0) {
        bootbox.confirm("Are you sure you want to permanently delete these records?", function(result) {
          if (result) {
            for (var i = 0; i < removeEmployee.length; i++) {
              if (removeEmployee[i].checked) {
                EmployeeAction.notArchive(removeEmployee[i].value, that.resetCheckbox.bind(that))
              }
            }
          }
        })
      }
    }
  
  _onChange() {
    var that = this
    EmployeeAction.getEmployee(function() {
      that.setState(that.getEmployees())
    })
  }
getNameNational(idNationality){
   let _nationality = ''
      let _i = 0
      while (true) {
        if (!idNationality)
          break
        if (NationalConst[_i].value == idNationality) {
          _nationality = NationalConst[_i].name
          break
        }
        ++_i
      }
      return _nationality
}
  render() {
    return (
        <div>
          <div className="container-fluid">
            <div className="rows">
              <Breadcumb dataUri={[{'link':'home','name':'Home'}]} activeName="Employee List" />
            </div>
            <div className="rows">
              <div className="name-page">Employee List</div>
              <div className="panel">
                <div className="row">
                  <div className="panel-heading sc-panel-heading">
                         <Link to='add-employee'>
                          <button className="btn btncreative btn-5 btn-5b icon-plus sc-btn-align-panel-heading" id="addEmployee"><span>Add New</span></button>
                        </Link>
                        <button className="btn btncreative btn-5 btn-5a icon-remove sc-btn-align-panel-heading" id="deleteEmployee" onClick={this.handleRemoveClick.bind(this)}><span>Delete</span></button>
                  </div>
                </div>
                <div id="showTable">
                        <Griddle
                         useGriddleStyles={false}
                         enableToggleCustom={true}
                         results={this.state.ListEmployee}
                         tableClassName="table"
                         showFilter={true}
                         columnMetadata={columnMeta}
                         showSettings={true}
                         nextIconComponent=<i className="fa fa-long-arrow-right" style={{marginLeft:"8px"}}></i>
                         previousIconComponent=<i className="fa fa-long-arrow-left" style={{marginRight:"8px"}}></i>
                         columns={ [ "__v", "firstName", "lastName","dateOfBirth","employeeId","locationName","nationalityName" ]}/>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }
}
export default EmployeeList;