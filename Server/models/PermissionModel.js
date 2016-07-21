import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const rolesSchema = new Schema({
        permissions:[{label: String}]
});
export default module.exports = mongoose.model('Permission', rolesSchema);