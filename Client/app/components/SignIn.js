import React from 'react';
import Input from 'react-bootstrap/lib/Input';
import UserActions from '../actions/UserActions.js';
import Auth from '../helper/AuthService';

class SignIn extends React . Component {
  constructor()
  {
    super();
    this.state={name:String,pass:String,switchAccount:Boolean};
    
  }
  componentDidMount()
  {
    /** slide **/
    var screenHeight =window.innerHeight;
    $('.slide1').css({'height':screenHeight+"px"});
     $('.slide2').css({'height':screenHeight+"px"});
      $('.slide3').css({'height':screenHeight+"px"});
    /** slide **/
    this.setState({switchAccount:true});
  }
  handleNameChange(e) {
    this.setState({name: e.target.value});
  }
  handlePassChange(e) {
    this.setState({pass: e.target.value});
  }
 handleClickSubmit(e) {
    e.preventDefault();
    Auth.login(this.state.name, this.state.pass)
    .catch(function(err) {
    $('#errorSignin').html('Invalid credentials. Please Try Again');
    });
}
  onFocus()
  {
    $('#username').val('');
    $('#password').val('');
    $('#errorSignin').html('');
    this.setState({name:''});
    this.setState({pass: ''});
  }
  render() {
    var btnSubmit,forgetPass;
  var styleSpanAddon={background:'#fff','borderRight':'none','borderRadius':'0px',height:'40px'}
      btnSubmit=<button className="btn sc-btn-blue sc-btn-signin pull-right" onClick={this.handleClickSubmit.bind(this)} name="Submit" value="Login" type="Submit">Submit</button>;
      forgetPass = <a style={{color:'#ccc'}} className = 'btn btn-link pull-left' href = '/#/forget-pass'>Forgot password ?</a>
    return (
        <div>
          <div id="bg-fade-carousel" className="carousel slide carousel-fade" data-ride="carousel">
            <div className="carousel-inner">
              <div className="item active">
                <div className="slide1"></div>
              </div>
              <div className="item">
                <div className="slide2"></div>
              </div>
              <div className="item">
                <div className="slide3"></div>
              </div>
            </div>
            <div className="container carousel-overlay text-center">
              <div id="signIn" className="row">
                <div className="col-xs-12 col-sm-8 col-md-4 col-md-offset-4 col-sm-offset-2">
                  <div className="wrapper">
                    <div className="panel">
                      <div className="sc-panel-heading-signin">
                        <img className="img-rounded img-responsive logo-signin" src="Client/images/logo.png" />
                      </div>
                      <div className="panel-body">
                        <h4>Login to get started!</h4>
                        <br />
                        <fieldset>
                          <form action="" method="post" name="Login_Form" className="form-signin">
                            <span className="errorValidation" id="errorSignin"></span>
                            <div className="input-group">
                              <span style={styleSpanAddon} className="input-group-addon ">
                                <img src="Client/images/user-signin.png" />
                              </span>
                              <input style={{'borderLeft':'none','height':'40px','borderRadius':'0px'}} type="text" id="username" onChange={this.handleNameChange.bind(this)} className="form-control" name="Username" placeholder="Username" required="" autofocus="" />
                            </div>
                            <br />
                            <div className="input-group">
                                <span style={styleSpanAddon} className="input-group-addon ">
                                  <img src="Client/images/key-signin.png" />
                                </span>
                               <input style={{'borderLeft':'none','height':'40px','borderRadius':'0px'}} type="password" id="password" onChange={this.handlePassChange.bind(this)} className="form-control" name="Password" placeholder="Password" required="" />
                            </div> 
                            <br />
                             {forgetPass}
                            <button className="btn btncreative btn-4 btn-4a icon-arrow-right pull-right" style={{width:"100px",borderRadius:'0px',background:'#336aaa',height:'40px',color:"#fff"}} onClick={this.handleClickSubmit.bind(this)}>Submit</button>     
                          </form>
                        </fieldset>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
export default SignIn;