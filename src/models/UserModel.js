const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name:{type:String,trim:true},
    email: {
        type: String,
        trim: true,
        required: true,
        unique:true},
    password: {
        type: String, required: true,
        min: 6,
        max: 64
    }
   
   
}, {timestamps: true, versionKey: false })



const UserModel = mongoose.model('users', UserSchema)

module.exports = UserModel;

