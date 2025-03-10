require("dotenv").config();
const User =require("../models/user");
const {generateToken}=require("../jwtUtil");
const bcrypt =require('bcrypt');

exports.login =async(req,res)=>{
    try{
      const{username, password}=req.body;
      

    const user =await User.findOne({username});
    if(!user){
           return res.status(400).json({message:'Invalid username or password'});
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }
        
        const token = generateToken(user);
    
    res.status(200).json({
      message: 'Login successful',
      token,
     user: {
          id: user._id,
          username: user.username,
      } 
      });
      
     } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
    
};
