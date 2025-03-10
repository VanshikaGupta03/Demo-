const mongoose=require('mongoose');

const educationSchema=new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    Education_Details: [
    {
    Type_of_Education:{
        type:String,
        enum: ['HighSchool', 'Intermediate', 'Graduation', 'PostGraduation','PhD'],
        required:true,
    },
    Institute_Name:{
        type:String,
        required:true,
    },
    Percentage:{
       type:Number,
       min:0,
       max:100,
        required:true,
    },
    City:{
        type:String,
        required:true,
    },
}] 
});
const Education=mongoose.model("user_education_profile",educationSchema);

module.exports=Education;