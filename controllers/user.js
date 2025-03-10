const User = require("../models/user");

const XLSX=require("xlsx");
const fs = require("fs");
const path = require("path");


exports.getUserProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: Invalid user data in request" });
        }
        const userId = req.user.id;
        console.log(userId);

        const userData = await User.findById(userId).select("-password");
        if (!userData) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            message:
                'User Profile retrieved',
            user: userData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
}


exports.updateUserProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: Invalid user data in request" });
        }

        const userId = req.user.id;

        
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const {username, email, contact, ...updates } = req.body;

        if (email && email !== existingUser.email) {
            return res.status(400).json({ message: "You are not allowed to change email" });
        }
        if (contact && contact !== existingUser.contact) {
            return res.status(400).json({ message: "You are not allowed to change contact" });
        }
        if (username && username !== existingUser.username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                return res.status(400).json({ message: "Username is already taken" });
            }
        }
        if (username) {
            updates.username = username;
        }
        
        console.log(username);
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true } ).select("-password");

        
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" })
    }
}


exports.deleteUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        const deleteUser = await User.findByIdAndDelete(userId);

        if (!deleteUser) {
            return res.status(404).json({ message: "user not found" });
        }
        res.status(200).json({ message: "User deleted Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" })
    }
}
exports.getAllUsers = async (req, res) => {
    try {

        const userData = await User.find();

        if (!userData) {
            return res.status(404).json({ message: "user not found" });
        }
        res.status(200).json({ message: "Users fetched successfully", user: userData });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
}

exports.exportUsers = async (req, res) => {
    try {
        
        const users = await User.find({}, { _id: 0, password: 0,__v:0}); 
        if (!users) {
            return res.status(404).json({ message: "No users found" });
        }
      
        
        const usersData = users.map(user => ({
            UserName:user.username,
            Name: user.name, 
            Email: user.email,
            Contact: user.contact,
            ProfileImage: user.profileImage 
                ? `=HYPERLINK("${user.profileImage}", "View Image")`
                : "No Image"
        }));
      
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(usersData);

       
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

        const filePath = path.join(__dirname, "../exports/users.xlsx");
        XLSX.writeFile(workbook, filePath);

        
        res.download(filePath, "users.xlsx", (err) => {
            if (err) {
                console.error("File download error:", err);
                return res.status(500).json({ message: "Error downloading file" });
            }
            
            fs.unlinkSync(filePath);
        });

    } catch (error) {
        console.error("Error exporting users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};





