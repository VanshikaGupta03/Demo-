require("dotenv").config();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User=require("../models/user");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,
    },
  });
  const users = {};
  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  exports.resetRequest=async(req,res)=>{
    const { email } = req.body;
    const user = await User.findOne({ email });

  if (!user) 
    return res.status(400).json({ message: "You are not allowed to request an OTP" });

  // const allowedEmail = email;
  // if (email !== allowedEmail) {
  //     return res.status(403).json({ message: "You are not allowed to request an OTP" });
  // }


  const otp = generateOTP();
  users[email] = { otp, expires: Date.now() + 300000 }; 

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is ${otp}. It expires in 5 minutes.`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) 
        return res.status(500).json({ message: "Email not sent", error });
    res.json({ message: "OTP sent to email" });
  });
};
  
exports.verifyOtp=async (req, res) => {
    const { email, otp, newPassword } = req.body;
  
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "All fields are required" });
  
    const user = users[email];

    
    if (!user || user.otp !== otp || Date.now() > user.expires)
      return res.status(400).json({ message: "Invalid or expired OTP" });
  
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
   
    users[email] = { password: hashedPassword };
  
    res.json({ message: "Password reset successful" });
    console.log(otp);
  };