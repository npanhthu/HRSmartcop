import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const leaveEntitlementSchema = new Schema({
    employee: {employee_id:{type:String,required:true},
               name:String},
    leaveType:{name: String, leavetype_id:String,color:String},
    entitlementDay:{type:Number,required:true},
    leavePeriodId:{type:String}
});
export default module.exports = mongoose.model('LeaveEntitlement', leaveEntitlementSchema);