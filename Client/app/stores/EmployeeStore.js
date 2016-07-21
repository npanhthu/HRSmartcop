import EmployeeConstants from '../constants/EmployeeConstants';
import BaseStore from './BaseStore';
import jwt_decode from 'jwt-decode';


class EmployeeStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this))
    this.state = {employees: []}
  }
 getEmployeeList(){
        return this.state.employees;
    }
  _registerToActions(payload) {
    let action = payload.action;
    switch(action.type) {
      case EmployeeConstants.ADD_EMPLOYEE:
        this.state.employees = action.data
        this.emitChange();
        break;
      case EmployeeConstants.UPDATE_EMPLOYEE:
        this.emitChange();
        break;
      case EmployeeConstants.GET_EMPLOYEES:
        console.log("data ");
        this.state.employees = action.data;
        console.log(this.state.employees);
        break;
      case EmployeeConstants.NOT_ARCHIVE:
        console.log("den store ok");
        this.emitChange();
        break;
      default:
        break;
    };
  }
}

export default new EmployeeStore();