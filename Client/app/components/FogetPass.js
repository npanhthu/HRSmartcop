/**
 * Created by ryu on 04/08/2015.
 */
import React from 'react';
import Input from 'react-bootstrap/lib/Input';
import UserActions from '../actions/UserActions.js';
import UserStore from '../stores/UserStore.js'
import { Route, RouteHandler, Link } from 'react-router';
class ForgetPass extends React . Component {
    constructor()
    {
        super();
        this.state={email:'',loadingState:Boolean};
    }
    componentDidMount()
    {
        /** slide **/
        this.setState({loadingState:false});
        var screenHeight =window.innerHeight;
        $('.slide1').css({'height':screenHeight+"px"});
        $('.slide2').css({'height':screenHeight+"px"});
        $('.slide3').css({'height':screenHeight+"px"});
        /** slide **/
    }
    handleEmail(e) {
        this.setState({email: e.target.value});
        this.onFocus();

    }
    validateEmail(email) {
        var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return regex.test(email);
    }
    handleClickSubmit(e) {
        e.preventDefault();
        var that = this;
        var email = $('#email').val();

        if(!this.validateEmail(email)|| email == ""){
            if(email == ""){
                $('#errorSignin').html('Please input email address')
            }
            if(!that.validateEmail(email)){
                $('#errorSignin').html('Invalid email address')
            }
        }
        else{
            that.setState({loadingState:true});
            UserActions.forgetPass(email,function(){
                var msg = UserStore.forgetPass()
                if(msg.success){
                   bootbox.alert(msg.success,function(){})
                    $('#email').val(' ');
                    that.setState({loadingState:false});
                }
                if(msg.message){
                    $('#errorSignin').html(msg.message)
                    that.setState({loadingState:false});
                }
            })
        }
    }
    onFocus()
    {
        $('#errorSignin').html('');
        this.setState({mail:''});
    }
    render() {
        var styleSpanAddon={background:'#fff','borderRight':'none','borderRadius':'0px',height:'40px'}
        var displayLoading;
        if(this.state.loadingState == true)
        {
            displayLoading=<i style={{color:'#000'}} className="fa fa-circle-o-notch fa-spin fa-2x"></i>;
        }
        else
        {
            displayLoading=<img src="Client/images/envelope.png" />;
        }
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
                                        <h2 style={{color:"#fff"}}>Forget Password</h2>
                                    </div>
                                    <div className="panel-body">
                                        <fieldset>
                                            <form action="" method="post" name="Login_Form" className="form-signin">
                                                <span className="errorValidation" id="errorSignin"></span>
                                                <div className="input-group">
                                                    <span id="load" style={styleSpanAddon} className="input-group-addon">
                                                        {displayLoading}
                                                    </span>
                                                    <input style={{'borderLeft':'none','height':'45px','borderRadius':'0px'}} type="text" id="email" onChange={this.handleEmail.bind(this)} className="form-control" name="email" placeholder="Please input your email address" required="" autofocus="" />
                                                </div>
                                                <br />
                                                <Link to="login"><span style={{paddingTop:'10px'}} className="pull-left"><i style={{marginRight:'5px'}} className="fa fa-long-arrow-left"></i>Back</span></Link>
                                                <button className="btn btncreative pull-right" style={{width:"130px",borderRadius:'0px',background:'#336aaa',height:'40px',color:"#fff"}} onClick={this.handleClickSubmit.bind(this)} name="Submit" value="Reset" type="Submit">Reset Password  </button>
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
export default ForgetPass;