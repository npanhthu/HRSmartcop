import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const leaveSchema = new Schema({
 	workCountry: String,
 	workWeeks : {
	    monday:String,
	    tuesday:String,
	    wednesday:String,
	    thurday:String,
	    friday:String,
	    saturday:String,
    	sunday:String }
});
export default module.exports = mongoose.model('Works', leaveSchema);