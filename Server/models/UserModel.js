import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const usersSchema = new Schema({
    userrole: {essrole: String, supervisorrole: String, adminrole: String },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    employeeId: {
        type: String,
        required: true
    },
    status: Number,
    accType:Number,
    email: String,
    resetPasswordToken : String,
    resetPasswordExpires : String
});
export
default module.exports = mongoose.model('Users', usersSchema);