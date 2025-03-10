const multer = require("multer");
const path = require("path");



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
    

});

const fileFilter = (req, file, cb) => {
    const allowedExt = [".xlsx"];
    const ext = path.extname(file.originalname).toLowerCase();

    cb(null, allowedExt.includes(ext));
};
const upload = multer({ storage, fileFilter});

module.exports = upload;
