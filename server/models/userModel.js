const mongoose=require("mongoose")

const UserSchema=new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    friends:[{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    
},
{timestamps:true})


const userModel= mongoose.model("user",UserSchema);
module.exports={userModel}