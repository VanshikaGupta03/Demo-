const xlsx = require("xlsx");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/user");


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const generatePassword = () => crypto.randomBytes(8).toString("hex");

const importUsers = async (req, res) => {
    try {
        console.log(req.file);


        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const workbook = xlsx.readFile(req.file.path);
        // const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        // console.log("File Buffer:", req.file.buffer);

        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log(sheetData);

        const usersToInsert = [];

        for (const row of sheetData) {
            const { username, name, email, contact } = row;
            if (!username || !name || !email || !contact) continue;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                console.log(`User with email ${email} already exists.`);
                // res.status(400).json({message:"Email not sent"});
                continue;
            }


            const password = generatePassword();
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                username,
                name,
                email,
                contact,
                password: hashedPassword,
            });

            usersToInsert.push(newUser);

           

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Your Account Details",
                text: `Hello ${name},\n\nYour account has been created successfully.\nUsername: ${username}\nPassword: ${password}\n\nPlease change your password after logging in.`,
            });
        }

        
        await User.insertMany(usersToInsert)
            .then(() => console.log("Users inserted successfully!"))
            .catch((err) => console.error("Database Insert Error:", err));


        return res.status(200).json({ message: "Users imported and emails sent successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = importUsers;
