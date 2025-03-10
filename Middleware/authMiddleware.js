const jwt = require('jsonwebtoken');
const secretkey = process.env.JWT_SECRET_KEY;


module.exports = (req, res, next) => {
    try {
    const authHeader = req.headers.authorization;
    // console.log("Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Access denied' });
    }

    const token = authHeader.split(' ')[1];
    console.log(token);

   
        const decoded = jwt.verify(token, secretkey);
        console.log("Decoded Token:", decoded);
        req.user = { id: decoded.id, username: decoded.username };
        console.log("req.user After Decoding:", req.user);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token',error: err.message});
    }
};
