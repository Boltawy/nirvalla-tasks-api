import { responseError } from "../utils/errorHandler.js";

//MIGHTDO Create a schema for schemas, lol. (Probably Typescript)


function validate(schema) {
    const { headers, params, query, body } = schema;
    return (req, res, next) => {
        if (headers) {
            const { error } = headers.validate(req.headers);
            if (error) {
                console.log(error)
                if (error) return next(new responseError(400, { "message": "Validation error", error }));
            }
        }

        if (params) {
            const { error } = params.validate(req.params);
            if (error) {
                console.log(error)
                if (error) return next(new responseError(400, { "message": "Validation error", error }));
            }
        }

        if (query) {
            const { error } = query.validate(req.query);
            if (error) {
                console.log(error)
                if (error) return next(new responseError(400, { "message": "Validation error", error }));
            }
        }

        if (body) {
            if (req.headers["content-type"] !== "application/json") return next(new responseError(400, { "message": "Validation error", error }));
            const { error } = body.validate(req.body);
            if (error) {
                console.log(error)
                if (error) return next(new responseError(400, { "message": "Validation error", error }));
            }
        }

        next();
    };
}


export { validate };



/* NOTES:
Joi validation only works when the request body is a JSON object and not completely empty.




*/