import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const employeeSchema = new Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true
    },

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type : String,
        required : true
    },
    location : {
        type : String
    },
    leaveBalance : Number,
    DLNumber : String, //Driver's License Number
    licenseExpiryData : String,
    gender : Number,
    maritalStatus : Number,
    nationality : Number,
    nickName: String,
    dateOfBirth : String,
    isArchive : Number,
    bloodGroup : String,
    imageUpload: String
});
export default module.exports = mongoose.model('Employees', employeeSchema);