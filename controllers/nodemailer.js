require("dotenv").config();
const nodemailer = require("nodemailer");
const {generateToken,verifyToken}=require("../jwtUtil");
const jwt=require('jsonwebtoken');
const User = require("../models/user");
const bcrypt=require("bcrypt");

exports.forgetPassword=async(req,res)=>{
   
        try{
            const {email}=req.body;
            if(!email){
                return res.status(400).json({message:"please Provide Email"});
            }
            
            const checkUser=await User.findOne({email});
            console.log("Email received:", email);
          

            if(!checkUser){
               return  res.status(400).json({message:"user not found"});
            }
            const token=generateToken(checkUser);
            const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
        

    const mailTransporter =
    nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            }
        }
    );

const mailDetails = {
    from: process.env.EMAIL_USER,
    to: "abc@gmail.com",
    subject: 'Password Reset Link',
    text: `Click on this link to forget your password: ${resetLink}`,
};



mailTransporter.sendMail(mailDetails);

return res.status(200).json({message:`Password rest link sent successfully:${resetLink}`});
}catch(error){
    res.status(400).json({message:"something went wrong", error: error.message});
}

    };
exports.resetPassword =async(req,res)=>{
      try{
          const {token}= req.params;
          console.log(token);
          const {password}=req.body;
          if(!password){
            return res.status(400).json({message:"Please Provide Password"});
          }
          const decode=verifyToken(token);
          //console.log(decode);

        const user= await User.findOne({_id:decode.id});
        console.log(user);

          const saltRounds = 10;
                  const hashedPassword = await bcrypt.hash(password,saltRounds);
                  
                  await user.save();

                  return res.status(200).json({message:"Password reset successfully"});
          
      }catch(error){
        return res.status(400).json({message:"something went wrong", error: error.message});
    }
 }

