import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const PeriodSchema = new Schema({
	idPeriod: {
		type: Number,
		required: true,
		unique: true
	},
	month: {
		type: String,
		required: true
	},
	
	day :{
		type: String,
		required: true
		
	},
	start:{
		type: Date,
		required: true
	},
	end:{
		type: Date,
		required: true
	},
	
});
export default module.exports = mongoose.model('Period', PeriodSchema);