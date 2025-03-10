const express =require('express');
const router= express.Router();

const { getUserProfile }= require("../controllers/user");
const {updateUserProfile}=require("../controllers/user");
const {deleteUserProfile}=require("../controllers/user");
const {getAllUsers}=require("../controllers/user");
const authMiddleware=require("../Middleware/authMiddleware");
const { exportUsers }=require("../controllers/user");
const upload = require('../config/MulterConfig');
const  importUsers=require("../controllers/importUsers");

const userSchema = require('../Validation/userValidation');



router.get('/user',authMiddleware,getUserProfile);
router.put('/update',authMiddleware,updateUserProfile);
router.post('/delete/:id',deleteUserProfile)
router.get('/all',getAllUsers);
router.get("/export-users", exportUsers);
router.post('/import-users',  upload.single("file"), importUsers);




module.exports=router;