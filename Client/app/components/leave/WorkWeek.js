import React from 'react';
import WorkWeekAction from '../../actions/LeaveActions.js';
import Router from 'react-router';
import LeaveStore from '../../stores/LeaveStore.js';
import NationalConst from '../../constants/NationalityConst';
import LoginStore from '../../stores/LoginStore.js';
import Permission,{checkHeader,checkFunction} from '../roles/Permission.js';
import RouterContainer from '../../helper/RouterContainer';
import Breadcumb from '../Breadcumb';
var Link = Router.Link;
class WorkWeek extends React . Component {

  constructor() {
    super();
    this.state = {
      works: []
    };
  }

  componentWillMount() {
      var _roles = LoginStore.role
      console.log("roles ", this._roles);
      if (checkFunction(_roles,'3','1') == false) {
          RouterContainer.get().replaceWith('/error')
      }
    this.loadDataWorkWeeks( 1 )
  }

    hideFunction(){
        $("#sc-workweek-edit").hide()
    }

    componentDidMount(){
        var _roles = LoginStore.role
        this.hideFunction();
        if(checkFunction(_roles, '3', '2') == true){
            $("#sc-workweek-edit").show()
        }
    }

  loadDataWorkWeeks( country ) {
    WorkWeekAction.getWorkWeek( country, function ( data ) {

      if ( data ) {
        var _workWeeks = data.workWeeks;
        $( '#mon' ).val( _workWeeks.monday );
        $( '#tue' ).val( _workWeeks.tuesday );
        $( '#wed' ).val( _workWeeks.wednesday );
        $( '#thu' ).val( _workWeeks.thurday );
        $( '#fri' ).val( _workWeeks.friday );
        $( '#sat' ).val( _workWeeks.saturday );
        $( '#sun' ).val( _workWeeks.sunday );
      } else {
        $( '#mon' ).val( 'full' );
        $( '#tue' ).val( 'full' );
        $( '#wed' ).val( 'full' );
        $( '#thu' ).val( 'full' );
        $( '#fri' ).val( 'full' );
        $( '#sat' ).val( 'non' );
        $( '#sun' ).val( 'non' );
      }
    } );
  }
  handleChangeCountry( e ) {
    e.preventDefault()
    var _country = $( '#country' ).val()
    this.loadDataWorkWeeks( _country )
  }
  handleSubmit( e ) {
    e.preventDefault();
    $( '#sc-workweek-edit' ).css( { 'display': 'none' } );
    $( '#sc-workweek-save' ).css( { 'display': 'block' } );
    document.getElementById( "mon" ).disabled = false;
    document.getElementById( "tue" ).disabled = false;
    document.getElementById( "wed" ).disabled = false;
    document.getElementById( "thu" ).disabled = false;
    document.getElementById( "fri" ).disabled = false;
    document.getElementById( "sat" ).disabled = false;
    document.getElementById( "sun" ).disabled = false;

  }
  handleSubmit1( e ) {
    e.preventDefault();
    $( '#sc-workweek-edit' ).css( { 'display': 'block' } );
    $( '#sc-workweek-save' ).css( { 'display': 'none' } );
    document.getElementById( "mon" ).disabled = true;
    document.getElementById( "tue" ).disabled = true;
    document.getElementById( "wed" ).disabled = true;
    document.getElementById( "thu" ).disabled = true;
    document.getElementById( "fri" ).disabled = true;
    document.getElementById( "sat" ).disabled = true;
    document.getElementById( "sun" ).disabled = true;
    var _country = $( '#country' ).val();
    var _monday = $( '#mon' ).val();
    var _tuesday = $( '#tue' ).val();
    var _wednesday = $( '#wed' ).val();
    var _thurday = $( '#thu' ).val();
    var _friday = $( '#fri' ).val();
    var _saturday = $( '#sat' ).val();
    var _sunday = $( '#sun' ).val();
    var _leaveWorkWeek = {
      workCountry: _country,
      workWeeks: {
        monday: _monday,
        tuesday: _tuesday,
        wednesday: _wednesday,
        thurday: _thurday,
        friday: _friday,
        saturday: _saturday,
        sunday: _sunday
      }
    };
    WorkWeekAction.updateWork( _leaveWorkWeek, function ( msg ) {
      console.log( msg );
      $( '#successWorks' ).html( msg.success )
    } )

  }

  _onChange() {
    that.setState( that.getWorkItems() );
    var that = this;
    WorkWeekAction.getWork( function () {} )
  }


  render() {

    var day = function ( id, name ) {
      return (
      <div className="row">
        <div className="form-group col-sm-3">
          <label>{name}</label>
          <select id={id} className="form-control" disabled={dis}>
            <option value="full">Full Day</option>
            <option value="half">Half Day</option>
            <option value="non">Non-working Day</option>
          </select>
        </div>
      </div>

      )
    }
    var styleBtnEdit = { display: 'block', };
    var styleBtnSave = { display: 'none', };
    var dis = "disabled";
    var _nationals = NationalConst.map( function ( country ) {
      return (<option value={country.value}>
                {country.name}
              </option>)
    }.bind( this ) );
    return (
      <div className="container-fluid">
      <div className="rows">
        <Breadcumb dataUri={[{'link':'home','name':'Home'}]} activeName="Work Week" />
      </div>
      <div className="rows">
      <div className="name-page">Work Week</div>
    <div className="panel">
      <div className="panel-body">
        <form>
          <div className="row">
            <div className="form-group col-sm-3">
              <label>
                Country
                <span class="required" aria-riquire="true">*</span>
              </label>
              <select id="country" className="form-control" onChange={ this.handleChangeCountry.bind( this )}>
                {_nationals}
              </select>
            </div>
          </div>
          <p className="successForm" id="successWorks"></p>
          { day( "mon", "Monday" )}
          { day( "tue", "Tuesday" )} 
          { day( "wed", "Wednesday" )} 
          { day( "thu", "Thurday" )} 
          { day( "fri", "Friday" )} 
          { day( "sat", "Saturday" )} 
          { day( "sun", "Sunday" )}
          <div className="row">
            <div className="form-group col-sm-3">
              <button className="btn sc-btn-blue" style={styleBtnEdit} id="sc-workweek-edit" type="submit" onClick={this.handleSubmit}>
                Edit
              </button>
              <button className="btn sc-btn-green" style={styleBtnSave} id="sc-workweek-save" type="submit" onClick={this.handleSubmit1}>
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </div>
    </div>
    );
  }
}
export default WorkWeek;
