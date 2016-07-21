import React from 'react';
import Router from 'react-router';
import LeaveActions from '../../actions/LeaveActions.js';
import LeaveStore from '../../stores/LeaveStore.js';
import RouterContainer from '../../helper/RouterContainer';
import AuthenticatedComponent from '../AuthenticatedComponent';
import Breadcumb from '../Breadcumb';
import NationalConst from '../../constants/NationalityConst';
import ColorsConst from '../../constants/data/colorsConstant';
import LoginStore from '../../stores/LoginStore.js';
import Permission,{checkHeader} from '../roles/Permission.js';
var Link = Router.Link;
var ListColor = [];
export default AuthenticatedComponent (class AddTypeLeave extends React . Component {
    constructor() {
        super()
        this.state = { message: '' , ListLeaveType:[], ListColors:[]}
    }

    getMessage() {
        return { message: LeaveStore.getMessage }
    }

    _onChange1() {
        this.setState( this.getMessage )
        $('#messageResult1').html(this.state.message.message);
    }

    contains(a, obj) {
        var i = a.length;
        while (i--) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }

    getListColor(){
        var that = this;
        ListColor = [];
        this.state.ListColors = []
        LeaveActions.getAll(function(){
            var listLeaveType = LeaveStore.getLeaveType();
            var arr = [];
            for(var j = 0; j < listLeaveType.length;j++){
                arr[j] = listLeaveType[j].color;
            }
            for(var i = 0;i < ColorsConst.length;i++){
                if(!that.contains(arr, ColorsConst[i].value)){
                    ListColor.push({name:ColorsConst[i].name, value:ColorsConst[i].value})
                    that.setState({ListColors:ListColor});
                }
            }
        })
    }

    componentWillMount() {
        var _roles = LoginStore.role
        if (!checkHeader(_roles, '3')) {
            RouterContainer.get().replaceWith('/error')
        }
        this.getListColor();
        LeaveStore.addChangeListener( this._onChange1.bind( this ) )
    }

    handleValidate() {
        setTimeout( function () {
            document.getElementById( 'messageResult1' ).innerHTML = "";
        }, 3000 )
    }
    handleInput(){
        $('#errorValidate').html('');
    }

    handleCancel() {
        RouterContainer.get().transitionTo( '/leave-types' )
    }

    handleClickSave( e ) {
        e.preventDefault();
        var that = this
        var leaveType = $( '#name' ).val();
        var country = $( '#location' ).val();
        var color = $('#color').val();
        console.log( leaveType );
        var data = { leavetype: leaveType, country:country, _color:color }
        if ( leaveType == ""){
            document.getElementById( 'errorValidate' ).innerHTML = "LeaveType can not empty!";
        } else if ( leaveType.length < 5 || leaveType.length > 50 ) {
            document.getElementById( 'errorValidate' ).innerHTML = "LeaveType longer than 5 character and shorter 50 character!";
        } else {
            document.getElementById( 'errorValidate' ).innerHTML = "";
            LeaveActions.addLeaveType( data, function () {
                that.getListColor();
                that.setState( that.getMessage )
                $( '#name' ).val( '' );
                that.handleValidate();

            } )
        }
    }
    render() {
        let _nationals = NationalConst.map( function ( country ) {
            return (<option value={country.value}>
                        {country.name}
                    </option>)
            }.bind( this ) );
        console.log("List color ",ListColor);
        let _colors = this.state.ListColors.map(function(color){
            return(<option value={color.value}>{color.name}</option>)
        }.bind(this));
        return (
            <div>
                <div className="container-fluid">
                <div className="rows">
                        <Breadcumb dataUri={[{'link':'home','name':'Home'},{'link':'leave-types','name':'Leave Types'}]} activeName="Add leave type" />
                </div>
                <div className="rows">
                <div className="name-page">Add leave type</div>
                <div className="panel"> 
                    <div className="panel-body">
                        <form>
                            <p className="successForm" id="messageResult1"></p>
                            <div className="row">
                                <div className="form-group col-sm-3">
                                    <label>Country*</label>
                                    <select id="location" className="form-control">
                                        {_nationals}
                                    </select>
                                    <span className="errorValidation" id="errorValidationLocation"></span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-sm-3">
                                    <label>Name*</label>
                                    <input type="text" className="form-control" id="name" onChange= {this.handleInput.bind(this)} />
                                    <span className="errorValidation" id="errorValidate"></span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-sm-3">
                                    <label>Color*</label>
                                    <select id="color" className="form-control">
                                        {_colors}
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-sm-6">
                                    <button
                                        className="btn sc-btn-green"
                                        type="submit"
                                        onClick={ this.handleClickSave.bind( this )}>
                                        Save
                                    </button>&nbsp;
                                    <button
                                        className="btn sc-btn-gray"
                                        type="submit"
                                        onClick={ this.handleCancel.bind( this )}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                </div>
                </div>
            </div>
        );
    }
});

