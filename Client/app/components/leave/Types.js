import React from 'react';
import LeaveActions from '../../actions/LeaveActions.js';
import LeaveStore from '../../stores/LeaveStore.js';
import AuthenticatedComponent from '../AuthenticatedComponent';
import Router from 'react-router';
import NationalConst from '../../constants/NationalityConst';
import columnMeta from '../../utils/griddle/GriddleLeaveType';
import Permission,{checkFunction,checkHeader} from '../roles/Permission.js';
import LoginStore from '../../stores/LoginStore.js';
import RouterContainer from '../../helper/RouterContainer';
import Griddle from 'griddle-react';
import Breadcumb from '../Breadcumb';
var Link = Router.Link;
export default AuthenticatedComponent( class Types extends React . Component {
constructor() {
  super();
  this.state = {
    leavetypes: []
  };
}

getLeaveType() {
  let _listType = LeaveStore.getLeaveType()
  for (var i = 0; i < _listType.length; i++) {
    _listType[ i ].countryName = this.getCountryName( _listType[ i ].country )
  }
  return { leavetypes: _listType };
}
getCountryName( countryId ) {
  for (var i = 0; i < NationalConst.length; i++) {
    if ( NationalConst[ i ].value == countryId )
      return NationalConst[ i ].name
  }
  return countryId
}
componentWillMount() {
    var _roles = LoginStore.role
    if(checkFunction(_roles,'3','1') == false){
        RouterContainer.get().replaceWith('/error')
    }
  LeaveStore.addChangeListener( this._onChange.bind( this ) );
  var that = this;
  LeaveActions.getAll( function () {
    that.setState( that.getLeaveType() );
  } );
}

    hideFunction(){
        $("#addNew").hide()
        $("#delete").hide()
    }

    componentDidMount(){
        var _roles = LoginStore.role
        this.hideFunction();
        if(checkFunction(_roles, '3', '2') == true){
            $("#addNew").show()
            $("#delete").show()
        }
    }


checkSelectedRole( rmvUser ) {
  var count = 0;
  for (var i = 0; i < rmvUser.length; i++) {
    if ( rmvUser[ i ].checked ) {
      count++
    }
  }
  return count;
}
resetCheckbox() {
  var rmvType = document.getElementsByName( 'checkdel' );
  for (var i = 0; i < rmvType.length; i++) {
    rmvType[ i ].checked = false
  }
}

handleRemoveClick( e ) {
  e.preventDefault();
  var that = this;
  var rmvType = document.getElementsByName( 'checkdel' );

  if ( this.checkSelectedRole( rmvType ) > 0 ) {
    bootbox.confirm( "Are you sure want to permanently delete these records?", function ( result ) {
      if ( result ) {
        for (var i = 0; i < rmvType.length; i++) {
          if ( rmvType[ i ].checked )
            LeaveActions.removeLeaveType( rmvType[ i ].value, that.resetCheckbox.bind( that ) )
        }
      }
    } )
  }
}

_onChange() {
  var that = this;
  LeaveActions.getAll( function () {
    that.setState( that.getLeaveType() );
  } );
}

render() {
  return (
  <div>
    <div className="container-fluid">
      <div className="rows">
        <Breadcumb dataUri={ [ { 'link': 'home', 'name': 'Home' } ]} activeName="Leave Type" />
      </div>
      <div className="rows">
        <div className="name-page">Leave Type</div>
        <div className="panel">
          <div className="panel-heading">
            <div className="row">
                      <Link to="add-type-leave">
                      <button className="btn btncreative btn-5 btn-5b icon-plus sc-btn-align-panel-heading" id="addNew"><span>Add New</span></button>
                      </Link>
                      <button onClick={ this.handleRemoveClick.bind( this )} className="btn btncreative btn-5 btn-5a icon-remove sc-btn-align-panel-heading" id="delete">
                        <span>Delete</span>
                      </button>
                    </div>
                </div>
                <div id="showTable">
                <div className="col-md-5 col-sm-8">
                  <Griddle
                         useGriddleStyles={false}
                         enableToggleCustom={true}
                         results={this.state.leavetypes}
                         tableClassName="table"
                         showFilter={ true}
                         columnMetadata={columnMeta}
                         showSettings={ true}
                         nextIconComponent=<i className="fa fa-long-arrow-right" style={{marginLeft:"8px"}}></i>
                         previousIconComponent=<i className="fa fa-long-arrow-left" style={{marginRight:"8px"}}></i>
                         columns={ [ "leaveType", "countryName", "_id" ]} />
                 </div>
                </div>
              </div>
      </div>
    </div>
  </div>
  );
}
} );
