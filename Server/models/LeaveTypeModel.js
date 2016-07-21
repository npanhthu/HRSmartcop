import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const leaveSchema = new Schema({
    leaveType: {
        type: String,
        required: true,
        unique: true
    },
    country: {
        type: String,
        required: true
    },
    color:String
});
export default module.exports = mongoose.model('LeaveType', leaveSchema);