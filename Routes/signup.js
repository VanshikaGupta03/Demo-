const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/signup');
const {userSchema,validate}=require('../Validation/userValidation');
const {forgetPassword}=require("../controllers/nodemailer");
const {resetPassword}=require("../controllers/nodemailer");
const upload=require("../config/MulterConfig");
const {resetRequest, verifyOtp}=require("../controllers/mailOtp");



router.post('/signup',  upload.single("profileImage"),validate(userSchema),signup);
router.post('/forgetPassword',forgetPassword);
router.post('/resetPassword/:token',resetPassword);
router.post('/resetRequest',resetRequest);
router.post('/verifyOtp',verifyOtp);
module.exports = router;