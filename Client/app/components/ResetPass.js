/**
 * Created by ryu on 05/08/2015.
 */
import React from 'react';
import Input from 'react-bootstrap/lib/Input';
import UserActions from '../actions/UserActions.js';
import UserStore from '../stores/UserStore.js'
import RouterContainer from '../helper/RouterContainer';
class ResetPass extends React.Component {
    constructor()
    {
        super();
        this.state={token:'',password:''};
    }
    componentDidMount(){
        /** slide **/
        var screenHeight =window.innerHeight;
        $('.slide1').css({'height':screenHeight+"px"});
        $('.slide2').css({'height':screenHeight+"px"});
        $('.slide3').css({'height':screenHeight+"px"});
        /** slide **/
        var that = this
        var url = window.location.toString()
        var token = url.substring(30,url.length)
        UserActions.checkToken(token,function(){
            that.setState({token:token})
            var msg = UserStore.forgetPass()
            if(msg.success){
                $('#reset').show()
            }
            if(msg.message){
                bootbox.alert(msg.message,function(){})
                RouterContainer.get().transitionTo('/forget-pass')
            }
        })
    }
    handlePassword(e) {
        this.setState({password: e.target.value});
        this.onFocus();
    }
    handleConfirmPass(e) {
        this.setState({confirmPass: e.target.value});
        this.onFocus();
    }
    handleClickSubmit(e) {
        e.preventDefault();
        var that = this;
        var password = $('#password').val();
        var confirmPass = $('#confirmPass').val();
        if(password==""||confirmPass=="" ){
            if(password == ""){
                $('#errorPassword').html('Please input new password')
            }
            if(confirmPass==""){
                $('#errorConfirmPass').html('Please input confirm password')
            }
        }
        else{
            if(password!=confirmPass){
                $('#errorReset').html('Password and confirm password are not alike');
            }
            else{
                var user = {
                    resetPasswordToken :that.state.token,
                    password : that.state.password
                };
                UserActions.changePass(user,function(){
                    var msg = UserStore.forgetPass()
                    if(msg.success){
                        bootbox.alert(msg.success,function(){})
                        RouterContainer.get().transitionTo('/login')
                    }
                    if(msg.message){
                        $('#errorReset').html(msg.message)
                    }
                })
            }
        }
    }
    onFocus()
    {
        $('#errorPassword').html('');
        $('#errorConfirmPass').html('');
        $('#errorReset').html('');
    }
    render(){
        var styleSpanAddon={background:'#fff','borderRight':'none','borderRadius':'0px',height:'40px'}
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
                                        <h2 style={{color:"#fff"}}>Reset Password</h2>
                                    </div>
                                    <div className="panel-body">
                                        <fieldset>
                                            <form action="" method="post" name="Login_Form" className="form-signin">
                                                <span className="errorValidation" id="errorReset"></span>
                                                <div className="input-group">
                                                    <span style={styleSpanAddon} className="input-group-addon ">
                                                        <img src="Client/images/key-signin.png" />
                                                    </span>
                                                    <input style={{'borderLeft':'none','height':'40px','borderRadius':'0px'}} type="password" id="password" onChange={this.handlePassword.bind(this)} className="form-control" name="password" placeholder="Please input new password" required="" autofocus="" />
                                                </div>
                                                <span className="errorValidation" id="errorPassword"></span>
                                                <br />
                                                <div className="input-group">
                                                    <span style={styleSpanAddon} className="input-group-addon ">
                                                        <img src="Client/images/key-signin.png" />
                                                    </span>
                                                    <input style={{'borderLeft':'none','height':'40px','borderRadius':'0px'}} type="password" id="confirmPass" onChange={this.handleConfirmPass.bind(this)} className="form-control" name="confirmPass" placeholder="Confirm new password" required="" autofocus=""  />
                                                </div>
                                                <span className="errorValidation" id="errorConfirmPass"></span>
                                                <br />
                                                <button className="btn btncreative btn-4 btn-4a icon-arrow-right pull-right" style={{width:"100px",borderRadius:'0px',background:'#336aaa',height:'40px',color:"#fff"}} onClick={this.handleClickSubmit.bind(this)} name="Submit" value="Reset" type="Submit">Confirm </button>
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
    };
}
export default ResetPass;
