import React from 'react';
import Nav from './Nav';
import LoginStore from '../stores/LoginStore';
import EmployeeStore from '../stores/EmployeeStore.js'
import EmployeeAction from '../actions/EmployeeActions.js'
import { Route, RouteHandler, Link } from 'react-router';
import AuthService from '../helper/AuthService';
import Footer from './Footer';

class HeaderAfterLogin extends React . Component {
  constructor() {
    super()
    this.state = this._getLoginState();
  }
  _getLoginState() {
    return {userLoggedIn: LoginStore.isLoggedIn(),user:LoginStore.user,ava: ''};
  }
  getAvatar(){
    var that = this;
    var id = this.state.user.employeeId;
    var defaultImage = '';
    jQuery.get('Server/data/imageDefault.txt', function(data) {
      defaultImage = data;
    });
    EmployeeAction.getAnEmployee(id,function(){
      if(that.state.ava ==''){
        if(EmployeeStore.getEmployeeList().imageUpload =='' || EmployeeStore.getEmployeeList().imageUpload ==' '){
          console.log('default')
          that.setState({ava: defaultImage})
        }
        else{
          that.setState({ava: EmployeeStore.getEmployeeList().imageUpload})
        }
      }
    })
  }
  componentDidMount() {
    this.changeListener = this._onChange.bind(this);
    LoginStore.addChangeListener(this.changeListener);
  }
  _onChange() {
    this.setState(this._getLoginState());
  }
  componentWillUnmount() {
    LoginStore.removeChangeListener(this.changeListener);
  }
  render() {

    return (
      <div>
        {this.headerItems}
        <RouteHandler/>
        {this.footerItems}
      </div>
      );
  }
  logout(e) {
    e.preventDefault();
    AuthService.logout();
    location.reload();
  }
  get headerItems() {
    if (!this.state.userLoggedIn) {
      return (
        <div></div>
        )
    }
     else {
      var that = this
      this.getAvatar();
      var styleIcon={width:"24px",height:"24px",margin:"0 3px 0 0"};
      var styleIconSmartDev={width:"16px",height:"16px",margin:"-10 0 0 10px"};
      var styleLogo={width:'120px',height:'25px',margin:'7px 0px 0px 50px'};
      var userName="";
      var name = this.state.user.username
      var nameSD = ''
      var check = name.search('@smartdev.vn')
      if (check !=-1){
          var first = name.split('.')
          var last = first[1].split('@')
          nameSD = first[0]+' '+last[0]
      }
      if(check == -1)
      {
        userName=<span><img className="img-circle"  style={styleIcon} src= {that.state.ava} />{this.state.user.username}</span>;
      }
      else
      {
        userName=<span><img style={styleIconSmartDev} src="../Client/images/icon.png" /> <img className="img-circle"  style={styleIcon} src= {that.state.ava} />{nameSD}</span>;
      }
      return (
        <div>
          <div className="row headerTop">
            <div className="col-md-2 col-sm-4 hidden-xs">
              <Link to="home">
              <div className="logoAnimation">
                <img className="img img-responsive" style={styleLogo} src="../Client/images/logo.png" />
              </div>
              </Link>
            </div>
            <div className="visible-xs">
              <Link to="home">
              <div className="logoAnimation2">
                <img className="img img-responsive" style={styleLogo} src="../Client/images/logo.png" />
              </div>
              </Link>
            </div>
            <div className="col-md-9 col-sm-7"><Nav /></div>
            <div className="col-md-1 col-sm-1">
              <div className="dropdown dropdown-menu-bar pull-right">
                <button className="btn dropdown-toggle button-header" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="true">
                 <span className="username-header">{userName}</span>
                  <span className="fa fa-sort-desc"></span>
                </button>
                <ul className="dropdown-menu dropdown-menu-nav" role="menu" aria-labelledby="dropdownMenu1">
                  <li role="presentation"><a role="menuitem" tabindex="-1" onClick={this.logout}><span>Log Out</span></a></li>
                </ul>
              </div>
            </div>
          </div>
          
        </div>
        )
    }
  }
  get footerItems()
  {
      return(<div><Footer /></div>)
  }
}
export default HeaderAfterLogin;