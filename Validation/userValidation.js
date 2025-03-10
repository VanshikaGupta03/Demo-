const Joi = require('joi');

const validate = (userSchema) => (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error)
         return res.status(400).json({ error: error.details.message });
    next();
};


const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    contact:Joi.string().min(10).required(),
    password: Joi.string().min(6).required(),
    
});



module.exports = {userSchema,validate};
