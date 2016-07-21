import EmployeeConstants from '../constants/EmployeeConstants';
import AppDispatcher from '../AppDispatcher';
import EmployeeAPI from '../helper/EmployeeAPI';

export default {
  getEmployeeId: (success)=>{
    EmployeeAPI.getEmployeeId(success)
  },
  addEmployee: (employee,getMsg)=>{
    EmployeeAPI.createEmployee(employee,getMsg,(data)=>{AppDispatcher.handleAction({
      type:EmployeeConstants.ADD_EMPLOYEE,
      data: data
    })},getMsg)
  },
  updateEmployee: (employee,getMsg)=>{
    EmployeeAPI.updateEmployee(employee,getMsg,(data)=>{
      AppDispatcher.handleAction({
        type:EmployeeConstants.UPDATE_EMPLOYEE,
        data: data
      })},getMsg)
  },
  getAnEmployee: (employeeId,getData)=>{
    EmployeeAPI.getAnEmployee(employeeId,(data)=>{
      AppDispatcher.handleAction({
        type:EmployeeConstants.ADD_EMPLOYEE,
        data: data
      })
    },getData)
  },
  getEmployee:(showme)=>
  {
    EmployeeAPI.getAll((data) => {
      AppDispatcher.handleAction({
        type:EmployeeConstants.GET_EMPLOYEES,
        data:data
      });
    },null,showme);
  },
  notArchive:(id, reset)=>
  {
    console.log(id);
    EmployeeAPI.notArchive(id,reset,(data)=>{
      AppDispatcher.handleAction({
        type:EmployeeConstants.NOT_ARCHIVE,
        data:data
      });
    },reset)
  }
}
