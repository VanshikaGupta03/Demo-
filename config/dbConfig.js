const mongoose=require('mongoose');

const connection=async()=>{
    try{
         await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  }
  catch(err){
    console.error('MongoDB connection error:', err);
  }
};
module.exports=connection;

  