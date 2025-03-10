const express =require('express');
const router= express.Router();
const authMiddleware = require("../Middleware/authMiddleware");

const {userEducation,getEducation,updateEducation}=require('../controllers/user_education_profile');


router.post('/add',authMiddleware,userEducation);
router.get('/fetch',getEducation);
router.put('/update',authMiddleware,updateEducation);



module.exports=router;