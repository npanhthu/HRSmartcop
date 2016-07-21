import React from 'react';
import LeaveActions from '../../actions/LeaveActions.js';
import RouterContainer from '../../helper/RouterContainer';
import LoginStore from '../../stores/LoginStore.js';
import Permission,{checkFunction} from '../roles/Permission.js';
import Router from 'react-router';
import Breadcumb from '../Breadcumb';
var Link = Router.Link;
class Period extends React.Component
{
    
 constructor()
    {
        super();
    }
    componentWillMount()
    {
        var _roles = LoginStore.role
        console.log("roles ", this._roles);
        if (checkFunction(_roles,'3','1') == false) {
            RouterContainer.get().replaceWith('/error')
        }
        LeaveActions.getLeavePeriod(function(data){
                console.log("Data");
                console.log(data);
                var mo = data.month -1;
                $('#month').val(mo)
                $('#date').val(data.day)
                $('#dayBeginToEnd').html(data.start.substring(0, 10)+' to '+data.end.substring(0, 10));
               
                var date = new Date(data.month +"-"+data.day+"-2015");               
                date.setMonth(date.getMonth());
                date.setDate(date.getDate() - 1 );
                var dd = date.getDate();
                var month = new Array();
                    month[0] = "January";
                    month[1] = "February";
                    month[2] = "March";
                    month[3] = "April";
                    month[4] = "May";
                    month[5] = "June";
                    month[6] = "July";
                    month[7] = "August";
                    month[8] = "September";
                    month[9] = "October";
                    month[10] = "November";
                    month[11] = "December";
                    
                var MM = month[date.getMonth()];               
                $('#theMonth').html(MM);
               $('#theday').html(dd);
        })
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
    handleSubmit(e)
    {
        e.preventDefault();
       $('#sc-workweek-edit').css({'display':'none'});
       $('#sc-workweek-save').css({'display':'block'});
      document.getElementById("month").disabled = false;
      document.getElementById("date").disabled = false;
    
      
    }
     handleSubmit1(e)
    {
        e.preventDefault();
       $('#sc-workweek-edit').css({'display':'block'});
       $('#sc-workweek-save').css({'display':'none'});
      document.getElementById("month").disabled = true;
      document.getElementById("date").disabled = true;
      var month=parseInt($('#month').val()) + 1;
      var date=$('#date').val();
      var currenyear = new Date().getFullYear();
      
      var year;
      if(month >8){
          year = currenyear;
      }else{
          year = currenyear +1;
      }
      
      var end = new Date(month +"-"+date+"-"+year);
      var start = new Date('01-01-'+currenyear);
      start.setDate(start.getDate()+1);
      var leavePeriod={month:month,day:date, start: start, end: end};      
      LeaveActions.addLeavePeriod(leavePeriod,function(msg){
          
          $('#msg').html(msg.success);
      });
      LeaveActions.getLeavePeriod(function(data){                
          $('#dayBeginToEnd').html(data.start.substring(0, 10)+' to '+data.end.substring(0, 10));
      });
    }
    
 changeMonth(e){
     e.preventDefault()
     var mont=parseInt($('#month').val())
     var mo;
     if($('#date').val()=='1'){
         if(mont==0){
             mo=11;
         }else{
             mo = mont -1;
         }
     }else{
         mo = mont;
     }
     var month = new Array();
                    month[0] = "January";
                    month[1] = "February";
                    month[2] = "March";
                    month[3] = "April";
                    month[4] = "May";
                    month[5] = "June";
                    month[6] = "July";
                    month[7] = "August";
                    month[8] = "September";
                    month[9] = "October";
                    month[10] = "November";
                    month[11] = "December";
                    
                var MM = month[mo];                          
                $('#theMonth').html(MM);
 }
changeDay(e){
     e.preventDefault()
     var day=$('#date').val();
     var month = parseInt($('#month').val()) + 1;
     var currenyear = new Date().getFullYear();      
      var year;
      if(month >8){
          year = currenyear;
      }else{
          year = currenyear +1;
      }
     var date = new Date(month+'-'+day+'-'+year);
     date.setDate(date.getDate()-1);
     
     $('#theday').html(date.getDate());     
    var mont=parseInt($('#month').val())
     var mo;
     if($('#date').val()=='1'){
         if(mont==0){
             mo=11;
         }else{
             mo = mont -1;
         }
     }else{
         mo = mont;
     }
     var month = new Array();
                    month[0] = "January";
                    month[1] = "February";
                    month[2] = "March";
                    month[3] = "April";
                    month[4] = "May";
                    month[5] = "June";
                    month[6] = "July";
                    month[7] = "August";
                    month[8] = "September";
                    month[9] = "October";
                    month[10] = "November";
                    month[11] = "December";
                    
                var MM = month[mo];                          
                $('#theMonth').html(MM);
 }
    render() {   
    var styleBtnEdit= {
      display: 'block'
    };	
    var styleBtnSave= {
      display: 'none'
    };
   var dis = "disabled";  	
        return (<div className="container-fluid">
                    <div className="rows">
                        <Breadcumb dataUri={[{'link':'home','name':'Home'}]} activeName="Leave Period" />
                    </div>
                    <div className="rows">
                    <div className="name-page">Leave Period</div>
                <div className="panel">
                   <div className="panel-body">
                       <form>
                       <div className="row">
                       
                    		<div className="form-group col-sm-3">
                            <label className="successForm" id="msg"></label><br/>
	                    		<label>Start Month*</label>	                    		
                    			<select disabled={dis} onChange={this.changeMonth.bind(this)} id="month" className="form-control" >
                    				<option value="0">January</option>
                    				<option value="1">February</option>
                    				<option value="2">March</option>
                    				<option value="3">April</option>
                    				<option value="4">May</option>
                    				<option value="5">June</option>
                    				<option value="6">July</option>
                    				<option value="7">August</option>
                    				<option value="8">September</option>
                    				<option value="9">October</option>
                    				<option value="10">November</option>
                    				<option value="11">December</option>
                    			</select>
	                    		
                    		</div>
                		</div>	
                		 <div className="row">
                    		<div className="form-group col-sm-3">
	                    		<label>Start Date*</label>	                    		
	                    			<select disabled={dis} onChange={this.changeDay.bind(this)} id="date" className="form-control" >	                    			
	                    			<option value="1">1</option>
	                    			<option value="2">2</option>
	                    			<option value="3">3</option>
	                    			<option value="4">4</option>
	                    			<option value="5">5</option>
	                    			<option value="6">6</option>
	                    			<option value="7">7</option>
	                    			<option value="8">8</option>
	                    			<option value="9">9</option>
	                    			<option value="10">10</option>
	                    			<option value="11">11</option>
	                    			<option value="12">12</option>
	                    			<option value="13">13</option>
	                    			<option value="14">14</option>
	                    			<option value="15">15</option>
	                    			<option value="16">16</option>
	                    			<option value="17">17</option>
	                    			<option value="18">18</option>
	                    			<option value="19">19</option>
	                    			<option value="20">20</option>
	                    			<option value="21">21</option>
	                    			<option value="22">22</option>
	                    			<option value="23">23</option>
	                    			<option value="24">24</option>
	                    			<option value="25">25</option>
	                    			<option value="26">26</option>
	                    			<option value="27">27</option>
	                    			<option value="28">28</option>
	                    			<option value="29">29</option>
	                    		</select>
        	           		</div>
    	           		</div>
    	           		 <div className="row">
                    		<div className="form-group col-sm-3">
	                    		<label>End Date</label><br/>
	                    		<i id="theMonth"></i> <i id="theday"></i>
	                    		
                    		</div>
                    	</div>
                    	<div className="row">
                    		<div className="form-group col-sm-3">
	                    		<label>Current Leave Period </label><br/>
	                    		<i id="dayBeginToEnd"></i>
                    		</div>
                    	</div>
         				<div className="row">
                    		<div className="form-group col-sm-3">
	                    		<button className="btn sc-btn-blue" style={styleBtnEdit} id="sc-workweek-edit" type="submit" onClick={this.handleSubmit} >Edit</button>           
                        <button className="btn sc-btn-green" style={styleBtnSave} id="sc-workweek-save" type="submit" onClick={this.handleSubmit1} >Save</button>
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
export default Period;
