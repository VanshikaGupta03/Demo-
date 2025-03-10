const User = require("../models/user");
const bcrypt = require("bcrypt");

require("dotenv").config();

exports.signup = async (req, res) => {
    console.log("Request Body:", req.body);  
    console.log("Uploaded File:", req.file); 

        try {
            const { username, name, email, contact, password } = req.body;
            const existingUser = await User.findOne({ username });
             if (existingUser) {
            return res.status(400).json({ message: "Username already taken. Please choose a different one." });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already registered. Please use a different email." });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format. Please enter a valid email address." });
        }
        const existingContact = await User.findOne({ contact });
        if (existingContact) {
            return res.status(400).json({ message: "Contact number already in use. Please provide a different one." });
        }
            const saltRounds=10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const user = new User({
                username,
                name,
                email,
                contact,
                password: hashedPassword,
                profileImage: req.file?.path || null, 
            });

            await user.save();
            res.status(201).json({ message: "User created successfully", user });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }

}
