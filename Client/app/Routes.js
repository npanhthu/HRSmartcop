import React from 'react';
import { Route } from 'react-router';

import Container from './components/HeaderAfterLogin';
import SignInPage from './components/SignIn';
import UserPage from './components/users/SystemUser';
import SaveUserPage from './components/users/SaveSystemUser';
import EditUserPage from './components/users/EditSystemUser';
import CalendarPage from './components/leave/CalendarAssign';
import Home from './components/Home';
import Role from './components/roles/Role';
import AddRole from './components/roles/AddRoles.js';
import EditRole from './components/roles/EditRole.js';
import AddEmployee from './components/employee/AddEmployee.js';
import PersonalDetails from './components/employee/PersonalDetails.js';
import EmployeeList from './components/employee/EmployeeList.js';

import LeaveList from './components/leave/LeaveList.js';
import MyLeaveList from './components/leave/MyLeave.js';
import LeavePeriod from './components/leave/Period.js';
import LeaveTypes from './components/leave/Types.js';
import WorkWeek from './components/leave/Types.js';
import EditTypeLeave from './components/leave/EditTypeLeave.js';
import AddTypeLeave from './components/leave/AddTypeLeave.js';
import WorkWeeks from './components/leave/WorkWeek.js'

import AddLeaveEntitlement from './components/leave/AddLeaveEntitlement.js';
import ManageEntitle from './components/leave/ManageEntitle.js'
import EditEntitle from './components/leave/EditLeaveEntitlement.js'

import Error404 from './components/error/Error404.js';
import ForgetPass from './components/FogetPass.js'
import ResetPass from './components/ResetPass.js'

export default (
<Route handler={Container}>
  <Route name="home" path="/" handler={CalendarPage}/>
  <Route name="login" handler={SignInPage}/>
  <Route name="system-user" handler={UserPage} />
  <Route name="add-system-user" handler={SaveUserPage}/>
  <Route name="edit-system-user" handler={EditUserPage} path="/edit-system-user/:user"/>
  <Route name="calendar-view" handler={CalendarPage}/>
  <Route name="role" handler={Role}/>
  <Route name="add-role" handler={AddRole}/>
  <Route name="edit-role" path="edit-role/:role_id" handler={EditRole}/>
  <Route name="add-employee" handler={AddEmployee}/>
  <Route name="personal-details" handler={PersonalDetails} path="/personal-details/:employeeId?"/>
  <Route name="employee-list" handler={EmployeeList} />
  <Route name="leave-types" path="leave-types" handler={LeaveTypes}/>
  <Route name="edit-leave-type" path="/edit-leave-type/:identity?" handler={EditTypeLeave}/>
  <Route name="add-type-leave" path="add-type-leave" handler={AddTypeLeave}/>
  <Route name="work-week" handler={WorkWeeks}/>
  <Route name="leave-period"  handler={LeavePeriod}/>
  <Route name="leave-list" handler={LeaveList} />
  <Route name="add-leave-entitlement" handler={AddLeaveEntitlement}/>
  <Route name="manage-entitle" path="/manage-entitle" handler={ManageEntitle}/>
  <Route name="edit-entitle" path = "/edit-entitle/:_id" handler={EditEntitle}/>
  <Route name="error-404" path="/error" handler={Error404}/>
  <Route name="forget-pass" path = "/forget-pass" handler={ForgetPass} />
  <Route name="reset-pass" handler={ResetPass} path="/reset/:token?"/>
  <Route name="my-leave-list" handler={MyLeaveList} />
</Route>
);
