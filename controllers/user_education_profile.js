const Education = require("../models/user_education_profile");
const User=require("../models/user");


exports.userEducation = async (req, res) => {
    try {

        const userId = req.user.id;
        console.log(userId);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID is missing" });
        }
        const { Education_Details } = req.body;
        console.log(Education_Details);

        if (!Education_Details || !Array.isArray(Education_Details) || Education_Details.length === 0) {
            return res.status(400).json({ message: "All fields are required" });
        }
        

        const educationData= {
            userId:userId,
            Education_Details:Education_Details
        }
        console.log("My_Data",educationData);

        
        const newEducation = await Education.create(educationData);
        console.log(newEducation);
        res.status(201).json({ message: "User Education data added successfully", data: newEducation });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}


exports.getEducation = async (req, res) => {
    try {
        const EduData = await User.aggregate([
            {
                $lookup: {
                    from: "user_education_profiles", 
                    localField: "_id",  
                    foreignField: "userId", 
                    as: "education" 
                }
            },
            {
                $unwind: {
                    path: "$education",
                    preserveNullAndEmptyArrays: true 
                }
            },
            {
                $addFields: {
                    Education_Details: "$education.Education_Details"
                }
            },
            {
                $project: {
                    education: 0, 
                    password: 0 
                }
            }
        ]); 
       
        res.status(200).json({ message: "User Eduaction Data retrieved Successfully", data: EduData });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


exports.updateEducation = async (req, res) => {
    try {

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: Invalid user data in request" });
        }

        const userId = req.user.id;
        console.log(userId);
        console.log(req.user);

        let { Education_Details } = req.body;

        if (!Education_Details || !Array.isArray(Education_Details) || Education_Details.length === 0) {
            return res.status(400).json({ message: "Invalid data: Education_Details must be a non-empty array" });
        }

        Education_Details = Education_Details.map((education) => ({
            ...education,
            userId: userId
        }));
        let userEducation = await Education.findOne({ userId });
        console.log("Fetched Education Data:", userEducation)


        if (!userEducation) {
            console.log("Education data not found in the database.");
            return res.status(404).json({ message: "Education data not found for this user" });

        }

        
        userEducation = await Education.findOneAndUpdate(
            { userId },
            { $set: { Education_Details } },
            { new: true, runValidators: true } 
        );
        if (!userEducation) {
            console.log("Education data not found in the database.");
            return res.status(404).json({ message: "Education data not found for this user" });
        }

        

        res.status(200).json({
            message: "User Education updated successfully",
            data: userEducation
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}