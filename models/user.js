const mongoose=require('mongoose');


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    contact:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profileImage: { 
        type: String,
        required: false
     }
     
    //  {timestamps:true});
    });
const User= mongoose.model("user",userSchema);

module.exports=User;