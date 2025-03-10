const jwt=require('jsonwebtoken');

const secretkey =process.env.JWT_SECRET_KEY;

console.log(secretkey);



const generateToken=(user)=>{
   return jwt.sign( { id: user._id, username: user.username },secretkey, { expiresIn: '1h' } )
}  ;
      

const verifyToken=(token)=>{
    try{
        return jwt.verify(token,secretkey)
    }catch(error){
        return null;
    }
};

module.exports={generateToken, verifyToken};