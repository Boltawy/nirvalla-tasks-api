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

const taskListSchema = {
    body: Joi.object({
        title: Joi.string()
            .max(40)
            .required(),
        description: Joi.string()
            .max(200)
    })
}

export { loginSchema, signupSchema, taskListSchema };