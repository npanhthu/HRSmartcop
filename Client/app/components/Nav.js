import React from 'react';
import Router from 'react-router';
import LoginStore from '../stores/LoginStore.js';
var Link=Router.Link;
class Nav extends React.Component
{
    clockHeader(id,item,_roles){
        for(var j=0;j<_roles.length;j++){
            if(_roles[j]){
                if(_roles[j][0]){
                    for(var i=0;i<_roles[j][0].permissions.length;i++){
                        if(_roles[j][0].permissions[i].permission_id == item){
                            $(id).show();
                        }
                    }
                }
            }
        }
    }
    handleHide(){
        $("#user").hide()
        $("#userRole").hide()
        $("#configureId").hide()
        $("#leaveListId").hide()
        $("#entitlementId").hide();
        $("#assignLeaveId").hide();
        $("#readEmployeeId").hide();
        $("#writeEmployeeId").hide();
        $("#myLeaveListId").hide()
    }

    componentDidMount(){
        let _roles= LoginStore.role
        this.handleHide();
        this.clockHeader("#user",'0',_roles);
        this.clockHeader("#userRole",'1',_roles);
        this.clockHeader("#configureId",'3',_roles);
        this.clockHeader("#leaveListId",'4',_roles);
        this.clockHeader("#entitlementId",'5',_roles);
        this.clockHeader("#assignLeaveId",'6',_roles);
        this.clockHeader("#readEmployeeId",'7',_roles);
        this.clockHeader("#writeEmployeeId",'8',_roles);
        this.clockHeader("#myLeaveListId",'9',_roles);

        var userState =  document.getElementById("user")
        var userRoleState =  document.getElementById("userRole")
        var configureState =  document.getElementById("configureId")
        var leaveListState =  document.getElementById("leaveListId")
        var entitlementState =  document.getElementById("entitlementId")
        var assignLeaveState =  document.getElementById("assignLeaveId")
        var readEmployeeState =  document.getElementById("readEmployeeId")
        var writeEmployeeState =  document.getElementById("writeEmployeeId")
        var myLeaveListState =  document.getElementById("myLeaveListId")

        if(userState.style.cssText == 'display: none;' && userRoleState.style.cssText == 'display: none;'){
            $(".adminQL").hide();
        }
        if(configureState.style.cssText == 'display: none;' && leaveListState.style.cssText == 'display: none;' && myLeaveListState.style.cssText == 'display: none;' && entitlementState.style.cssText == 'display: none;' && assignLeaveState.style.cssText == 'display: none;'){
            $(".leaveQL").hide();
        }
        if(readEmployeeState.style.cssText.trim() == 'display: none;' && writeEmployeeState.style.cssText.trim() == 'display: none;'){
            $(".pimQL").hide();
        }

      $('.dropdown').on('show.bs.dropdown', function(e){
        $(this).find('.dropdown-menu').first().stop(true, true).slideDown("fast");
      });
      // Add slideUp animation to dropdown
      $('.dropdown').on('hide.bs.dropdown', function(e){
        $(this).find('.dropdown-menu').first().stop(true, true).slideUp("fast");
      });
    }
    render() {
        return (
            <div id="nav">
                    <nav className="navbar navbar-static-top">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav">
                                <li>
                                    <div className="dropdown">
                                        <a id="dLabel" role="button" data-toggle="dropdown" className="btn adminQL " data-target="#" href="/page.html">
                                            Admin <span className="caret"></span>
                                        </a>
                                        <ul className="dropdown-menu multi-level dropdown-menu-list" role="menu" aria-labelledby="dropdownMenu">
                                            <li className="dropdown-submenu">
                                                <a tabindex="-1" href = "#/system-user" className="link-origin-nav">User Management<span class="caret"></span></a>
                                                <ul className="dropdown-menu">
                                                    <li id="user"><Link to="system-user">User</Link></li>
                                                    <li id="userRole"><Link to="role">User Role</Link></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li>
                                    <div className="dropdown">
                                        <a id="dLabel" role="button" data-toggle="dropdown" className="btn pimQL" data-target="#" href="/page.html">
                                            PIM <span className="caret"></span> 
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-list">
                                            <li id="writeEmployeeId"><Link to="add-employee">Add Employee</Link></li>
                                            <li id="readEmployeeId"><Link to="employee-list">Employee List</Link></li>
                                        </ul>
                                    </div>
                                </li>
                                <li>
                                    <div className="dropdown">
                                        <a id="dLabel" role="button" data-toggle="dropdown" className="btn leaveQL" data-target="#" href="/page.html">
                                            Leave <span className="caret"></span>
                                        </a>
                                        <ul className="dropdown-menu multi-level dropdown-menu-list" role="menu" aria-labelledby="dropdownMenu">
                                            <li className="dropdown-submenu" id="configureId">
                                                <a tabindex="-1" href = "#/leave-types"className="link-origin-nav">Configure</a>
                                                <ul className="dropdown-menu">
                                                    <li><Link to="leave-types">Leave Types</Link></li>
                                                    <li><Link to="work-week">Work Week</Link></li>
                                                    <li><Link to="leave-period">Leave Period</Link></li>
                                                </ul>
                                            </li>
                                        
                                             <li className="dropdownMenu" id="leaveListId">
                                                <Link to="leave-list">Leave List</Link>
                                            </li>
                                            <li className="dropdown-submenu" id="entitlementId">
                                                <a tabindex="-1" className="link-origin-nav" href = "#/manage-entitle">Entitlement</a>
                                                <ul className="dropdown-menu">

                                                    <li><Link to="add-leave-entitlement">Add Entitlements</Link></li>
                                                    <li><Link to="manage-entitle">Manage Entitlements</Link></li>
                                                 </ul>
                                            </li>

                                            <li className="dropdownMenu" id="assignLeaveId">
                                                <Link to="calendar-view">Assign Leave</Link>
                                            </li>
                                              <li className="dropdownMenu" id="myLeaveListId">
                                                <Link to="my-leave-list">My Leave List</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </li>

                            </ul>
                        </div>
                    </nav>
            </div>
        );
    }
}
export default Nav;