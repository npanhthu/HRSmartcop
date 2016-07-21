
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const assignLeaveSchema = new Schema({
    leaveTypeId: {
        type: String,
        required: true
    },
    employeeId: {
        type: String,
        required: true
    },
    start_date: {
        type : String,
        required : true
    },
    end_date : {
        type : String,
        required : true
    },
    numberOfDay : Number,
    durationFrom: String,
    durationTo:String,
    text:String,//comment
    status: Number,
    color:String,
    user:String,
    leaveType:String
});
export default module.exports = mongoose.model('AssignLeave', assignLeaveSchema);