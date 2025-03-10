const express=require('express');
const router=express.Router();
const authMiddleware=require("../Middleware/authMiddleware");


const {login}= require("../controllers/login");

router.post('/login', login);



module.exports=router;