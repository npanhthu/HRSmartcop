import React from 'react';
import Router from 'react-router';
import LeaveActions from '../../actions/LeaveActions.js';
import LeaveStore from '../../stores/LeaveStore.js';
import RouterContainer from '../../helper/RouterContainer';
import AuthenticatedComponent from '../AuthenticatedComponent';
import NationalConst from '../../constants/NationalityConst';
import ColorsConst from '../../constants/data/colorsConstant';
import LoginStore from '../../stores/LoginStore.js';
import Permission,{checkHeader,checkFunction} from '../roles/Permission.js';
import Breadcumb from '../Breadcumb';
var Link = Router.Link;
export default AuthenticatedComponent (class EditTypeLeave extends React . Component {
    constructor() {
        super()
        this.state = {
            leaveType: {}
        }
    }

    getLeaveType() {
        return { leaveType: LeaveStore.getALeaveType }
    }

    componentWillMount() {
        var that = this;
        var _roles = LoginStore.role
        if(checkFunction(_roles,'3','2') == false){
            RouterContainer.get().replaceWith('/error')
        }
        var identify = this.props.params.identity;
        console.log( "id is " );
        console.log( identify );
        LeaveActions.getALeaveType( identify, function () {
            that.setState( that.getLeaveType() )
            $( '#typeLeave' ).val( that.state.leaveType.data.leaveType );
            $( '#location' ).val( that.state.leaveType.data.country );
            $( '#color' ).val( that.state.leaveType.data.color );
        } )
    }

    changeToTypeListPage() {
        setTimeout( function () {
            RouterContainer.get().transitionTo( '/leave-types' )
        }, 3000 )
    }

    handleCancel() {
        RouterContainer.get().transitionTo( '/leave-types' )
    }

    handleSubmit( e ) {
        e.preventDefault();
        var that = this
        var leaveType = $( '#typeLeave' ).val();
        var country = $('#location').val();
        var color = $('#color').val();
        var data = {
            identify: this.props.params.identity,
            leavetype: leaveType,
            country:country,
            _color:color
        }
        console.log(data);
        if ( leaveType == "" ) {
            document.getElementById( 'errorValidate' ).innerHTML = "LeaveType can not empty!";
        } else if ( leaveType.length < 5 || leaveType.length > 50 ) {
            document.getElementById( 'errorValidate' ).innerHTML = "LeaveType longer than 5 character and shorter 50 character!";
        } else {
            document.getElementById( 'errorValidate' ).innerHTML = "";
            LeaveActions.updateLeaveType( data, function () {
                console.log( "hoan thanh" );
                document.getElementById( 'messageResult' ).innerHTML = LeaveStore.getMessageUpdate;
                that.changeToTypeListPage();
            } )
        }
    }

    render() {
        let _nationals = NationalConst.map( function ( country ) {
            return (<option value={country.value}>
                        {country.name}
                    </option>)
            }.bind( this ) );
        let _colors = ColorsConst.map(function(color){
            return(<option value={color.value}>{color.name}</option>)
        }.bind(this));
        return (<div>
            <div className="container-fluid">
            <div className="rows">
                <Breadcumb dataUri={[{'link':'home','name':'Home'},{'link':'leave-types','name':'Leave Types'}]} activeName="Edit leave type" />
            </div>
            <div className="rows">
            <div className="name-page">Edit Leave Type</div>
            <div className="panel">
            <div className="panel-body">
                <form>
                    <p className="successForm" id="messageResult"></p>
                    <div className="row">
                        <div className="form-group col-sm-3">
                            <label>Country*</label>
                            <select id="location" className="form-control">
                                {_nationals}
                            </select>
                            
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-sm-3">
                            <label>Name*</label>
                            <input type="text" className="form-control" id="typeLeave" />
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
                        <div className="form-group col-sm-3">
                            <button className="btn sc-btn-green" type="submit" onClick={ this.handleSubmit.bind( this )}> Save </button>&nbsp;&#141;&nbsp;&#141;
                            <button className="btn sc-btn-gray" type="submit" onClick={ this.handleCancel.bind( this )}>Cancel</button>
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
