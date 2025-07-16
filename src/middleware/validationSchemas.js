import Joi from "joi";

export const signupSchema = {
    body: Joi.object({
        userName: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9 ]+$')) //Alphanum + space
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

export const loginSchema = {
    body: Joi.object({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .required()
    })
};

export const tasklistSchema = {
    body: Joi.object({
        title: Joi.string()
            .max(40)
            .required(),
        description: Joi.string()
            .max(200),
    })
}




export const taskSchema = { //MIGHTDO Handle if nested tasks are sent
    body: Joi.object({
        title: Joi.string()
            .max(40)
            .required(),
        description: Joi.string()
            .max(200),
        tasklistId: Joi.string(),
        tasklistTitle: Joi.string(),
        parentId: Joi.string(),
        subtasks: Joi.array().items(Joi.link().ref('taskSchema'))
    })
}

export const taskUpdateSchema = { //MIGHTDO extract common fields
    body: Joi.object({
        title: Joi.string()
            .max(40),
        description: Joi.string()
            .max(200),
        tasklistId: Joi.string(),
        tasklistTitle: Joi.string(),
        parentId: Joi.string(),
    })
}

export const populatedListSchema = { //For validating the "POST /sync" endpoint
    body: Joi.object({
        _id: Joi.string()
            .required(),
        title: Joi.string()
            .max(40)
            .required(),
        description: Joi.string()
            .max(200),
        tasks: Joi.array().items(taskSchema.body)
    })
}

export const populatedListArraySchema = {
    body: Joi.array().items(populatedListSchema.body)
}


//MIGHTDO: A way to sync mongoose schemas and joi schemas (joigoose)