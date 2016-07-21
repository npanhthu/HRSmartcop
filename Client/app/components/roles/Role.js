import React from 'react';
import RoleActions from '../../actions/RoleActions';
import RoleStore from '../../stores/RoleStore';
import AuthenticatedComponent from '../AuthenticatedComponent';
import Router from 'react-router';
import RouterContainer from '../../helper/RouterContainer';
var Link = Router.Link;
import Griddle from 'griddle-react';
import columnMeta from '../../utils/griddle/GriddleUserRole';
import Breadcumb from '../Breadcumb';
import Permission,{checkHeader,checkFunction} from '../roles/Permission.js';
import LoginStore from '../../stores/LoginStore.js';
export default AuthenticatedComponent(class Role extends React.Component
{
    constructor()
    {
        super();
        this.state={roles: []};
        this._roles = [];
    }

    getRoleItems()
    {
        return {roles:RoleStore.getRoles()};
    }
    hideFunction(){
        $("#addUser").hide()
        $("#delete").hide()
    }
    componentWillMount() {
        RoleStore.addChangeListener(this._onChange.bind(this));
        var that=this;
        RoleActions.getRole(function () {
            that.setState(that.getRoleItems());
        });
        this._roles = LoginStore.role
        if(!checkHeader(this._roles,'1')){
            RouterContainer.get().replaceWith('/error')
        }
    }
    componentDidMount(){
        var _roles = LoginStore.role
        this.hideFunction();
        if(checkFunction(_roles, '1', '2') == true){
            $("#addUser").show()
            $("#delete").show()
        }
    }

    checkSelectedRole(rmvUser)
    {
        var count = 0;
        for (var i = 0; i < rmvUser.length; i++) {
            if (rmvUser[i].checked) {
                count++
            }
        }
        return count;
    }
    resetCheckbox() {
        var rmvRole = document.getElementsByName('checkdel');
        for (var i = 0; i < rmvRole.length; i++) {
            rmvRole[i].checked = false
        }
    }
    handleRemoveClick(e)
    {
        e.preventDefault();
        var that=this;
        var rmvRole=document.getElementsByName('checkdel');
        if(this.checkSelectedRole(rmvRole) > 0)
        {
            bootbox.confirm("Are you sure want to permanently delete these records?", function(result) {
                if (result) {
                    for (var i = 0; i < rmvRole.length; i++) {
                        if (rmvRole[i].checked)
                            RoleActions.removeRole(rmvRole[i].value,that.resetCheckbox.bind(that))
                    }
                }
            })
        }
    }
    _onChange()
    {
        var that = this;
        RoleActions.getRole(function() {
            that.setState(that.getRoleItems());
        })
    }
    render() {
        return (<div>
                <div id="content-role" className="container-fluid">
                    <div className="rows">
                    <Breadcumb dataUri={[{'link':'home','name':'Home'}]} activeName="Roles Management" />
                    </div>
                    <div className="rows">
                        <div className="name-page">Roles Management</div>
                        <div className="panel">
                            <div className="panel-heading sc-panel-heading">
                                <div className="row">
                                        <Link to="add-role">
                                            <button className="btn btncreative btn-5 btn-5b icon-plus sc-btn-align-panel-heading" id="addUser"><span>Add New</span></button>
                                        </Link>
                                        <button className="btn btncreative btn-5 btn-5a icon-remove sc-btn-align-panel-heading" onClick={this.handleRemoveClick.bind(this)} id="delete"><span>Delete</span></button>
                                </div>
                            </div>
                            <div id="showTable">
                            <div className="col-md-5 col-sm-8">
                                <Griddle
                                 useGriddleStyles={false}
                                 enableToggleCustom={true}
                                 results={this.state.roles}
                                 tableClassName="table"
                                 showFilter={true}
                                 columnMetadata={columnMeta}
                                 showSettings={true}
                                 nextIconComponent=<i className="fa fa-long-arrow-right" style={{marginLeft:"8px"}}></i>
                                 previousIconComponent=<i className="fa fa-long-arrow-left" style={{marginRight:"8px"}}></i>
                                 columns={ [ "name", "type",  "_id" ]}/>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});