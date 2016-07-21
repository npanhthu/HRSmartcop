import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const rolesSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	type: {roleTypeId:String,nameType:String},
	permissions : [{permission_id: String,label:String,
		rights: [{name:String,right_id: String}]}]
});
export default module.exports = mongoose.model('Roles', rolesSchema);