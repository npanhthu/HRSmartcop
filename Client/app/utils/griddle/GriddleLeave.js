import React from 'react';
import Router,{Link} from 'react-router';
import EmployeeAction from '../../actions/EmployeeActions';
import LeaveActions from '../../actions/LeaveActions.js';
import ReactSelect from 'react-select';
import _    from 'lodash';

const _options = [
{ value: '0', label: 'Approve' },
{ value: '1', label: 'Cancel' },
{ value: '2', label: 'Reject' },
]
let _numOfDays=[]
export function getNumOfDays() {
  return _numOfDays
}
class Dates extends React . Component {
  constructor() {
    super()
    this.state = { date: '' }
  }
  componentDidMount() {
    if ( this.props.rowData.start_date == this.props.rowData.end_date ) {
      this.setState( { date: this.props.rowData.start_date } )
    } else {
      this.setState( {
        date: this.props.rowData.start_date + " to " + this.props.rowData.end_date
      } )
    }
  }
  render() {
    return (<div>{this.state.date}</div>)
  }
}

class EmployeeName extends React . Component {

  render() {
    return (<Link to='personal-details' params={{ employeeId: this.props.rowData.employeeId }}>{this.props.data}</Link>)
  }
}

class LeaveType extends React . Component {
  constructor() {
    super()
    this.state = { leaveType: '' }
  }
  componentDidMount() {
    let that = this
    LeaveActions.getALeaveType( this.props.data, function ( data ) {
      that.setState( { leaveType: data.data.leaveType } )
    } )
  }
  render() {
    return (<div>{this.state.leaveType}</div>)
  }
}

class LeaveBalance extends React . Component {
  constructor() {
    super()
  }
  render() {
    return (<div style={{textAlign:'center'}}>{this.props.rowData.leaveBalance}</div>)
  }
}
class NumberOfDay extends React . Component {
  constructor() {
    super()
    this.state={totalDays:0}
  }
  componentWillMount() {
    let that=this
    let _country = this.props.rowData.location
    let start_date=new Date(this.props.rowData.start_date)
    let end_date=new Date(this.props.rowData.end_date)
    let _durationFrom = this.props.rowData.durationFrom
    let _durationTo =this.props.rowData.durationTo
    let offset = end_date.getTime() - start_date.getTime()
    let _totalDays = Math.round(offset / 1000 / 60 / 60 / 24)    
    LeaveActions.getWorkWeek(_country, function ( data ) { 
    let totalDates =that.checkstartofweek(data,start_date,end_date,_durationFrom,_durationTo)
    that.setState({totalDays:totalDates})
    })
    setTimeout(function(){
            let tempData=that.props.rowData
      let check = _.find(_numOfDays, function(obj){ return obj._id == tempData._id })
      if(!check){
        _numOfDays.push({_id:tempData._id,numOfDays:that.state.totalDays});
      }  
    },2000)    
    }
  checkstartofweek(data,start_date,end_date,_durationFrom,_durationTo){
    let that=this
    let offset = end_date.getTime() - start_date.getTime()
    let _totalDays = Math.round(offset / 1000 / 60 / 60 / 24) 
    let total=0
     if(_totalDays==0){
        if(that.sumdays(data, start_date.getDay())!=0)
        {
            if(_durationFrom!=_durationTo) return _totalDays+1;
                                         return _totalDays+0.5
        }
        return _totalDays +1
     } 
     else {
      let start = start_date
      let end = end_date
      let startday=start_date.getDay()
      let endday=end_date.getDay()
      for (let i = start_date; i <= end; i.setDate(i.getDate()+1)) {
            total=total+that.sumdays(data,i.getDay());
            _total = total; 
          }
          if (that.sumdays(data, startday)!=0)             
            {
              var _total=0;
              if(_durationFrom=="FullDay"){   
                _total= total;
              }else { 
                _total= total-0.5;           
              }
          }
          if (that.sumdays(data, end_date.getDay())!=0) 
          {
              if(_durationTo=="FullDay"){
              
             _total= _total;
           }
             else { 
              _total= _total-0.5;
            }       
          }
       }
       return _total
     }
  sumdays(data,day){    
    switch(day){
    case 0:return this.checkworkweek(data.workWeeks.sunday)
    case 1:return this.checkworkweek(data.workWeeks.monday)
    case 2:return this.checkworkweek(data.workWeeks.tuesday)
    case 3:return this.checkworkweek(data.workWeeks.wednesday) 
    case 4:return this.checkworkweek(data.workWeeks.thurday)
    case 5:return this.checkworkweek(data.workWeeks.friday)
    case 6:return this.checkworkweek(data.workWeeks.saturday)
    }
  }
  checkworkweek(val){
  switch(val){
    case 'non':return 0
    case 'half':return 0.5
    case 'full':return 1
  }
}         
render() {
  return (<div style={{textAlign:'center'}}>{this.state.totalDays}</div>)
}
}

class Status extends React.Component{
  render(){
    return <div>{this.props.data}</div>
  }
}

class Actions extends React . Component {
  constructor() {
    super()
  }
  handleChangSelect(val){
    let _data={}
    let id=this.props.rowData._id
    _data._id=id
    _data.user='hoang day ne';
    switch(val){
      case '':
        _data.status=0
      break
      case '0':
        _data.status=1
      break
      case '1':
        _data.status=3
      break
      case '2':
        _data.status=2
      break
    }
    LeaveActions.upDateAssign( _data, function () {
      // that.loadData()
    } )
  }

  
  render() {
    let _status=this.props.rowData.status
    let _value=''
    switch(_status){
      case 0:
         _value=''
        break
      case 1:
         _value='0'
        break
      case 2:
         _value='2'
        break
      case 3:
        _value='1'
        break
    }
    if(_status==4){
      return (<div></div>)
    }
    return (<ReactSelect className="sc-react-select" value={_value} name='actions' placeholder='Select Action'  options={_options} onChange={this.handleChangSelect.bind(this)} />)
  }
}
export default [
{
  "columnName": "start_date",
  "order": 1,
  "locked": false,
  "visible": true,
  "customComponent": Dates,
  "displayName": "Date"
},
{
  "columnName": "employeeName",
  "order": 2,
  "locked": false,
  "visible": true,
  "customComponent": EmployeeName,
  "displayName": "Employee Name"
},
{
  "columnName": "user",
  "order": 3,
  "locked": false,
  "visible": true,
  "displayName": "User Name"
},
{
  "columnName": "leaveTypeId",
  "order": 4,
  "locked": false,
  "visible": true,
  "displayName": "Leave Type",
  "customComponent": LeaveType
},
{
  "columnName": "leaveBalance",
  "order": 5,
  "locked": false,
  "visible": true,
  "displayName": "Leave Balance(Days)",
  "customComponent": LeaveBalance
},
{
  "columnName": "end_date",
  "order": 6,
  "locked": false,
  "visible": true,
  "displayName": "Number of Days",
  "customComponent": NumberOfDay
},
{
  "columnName": "statusName",
  "order": 7,
  "locked": false,
  "visible": true,
  "displayName": "Status",
  "customComponent": Status
},
{
  "columnName": "__v",
  "order": 8,
  "locked": false,
  "visible": true,
  "displayName": "Actions",
  "customComponent": Actions
},
{
  "columnName": "status",
  "visible": false,
},
{
  "columnName": "_id",
  "visible": false,
},
{
  "columnName": "employeeId",
  "visible": false,
},
{
  "columnName": "duration",
  "visible": false,
},
{
  "columnName": "numberOfDay",
  "visible": false,
},
]
