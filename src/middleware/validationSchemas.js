import Joi from "joi";

const signupSchema = {
    body: Joi.object({
        userName: Joi.string()
            .alphanum()
            .min(3)
            .max(25)
            .required(),

        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .min(8)
            .max(30)
            .required(),
        image: Joi.string()
    })
};

const loginSchema = {
    body: Joi.object({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .required()
    })
};

export {loginSchema, signupSchema};