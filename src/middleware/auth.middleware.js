import jwt from "jsonwebtoken";
import { responseError } from "../utils/errorHandler.js";

const authenticate = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) throw new responseError(401, "Unauthorized");
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") throw new responseError(401, "Unauthorized");

    let _id;
    try {
        ({ _id } = jwt.verify(token, process.env.JWT_ACCESS_SECRET));
        if (jwt.decode(token).exp < Date.now() / 1000) {
            throw new responseError(401, "Token expired");
        }
    } catch (error) {
        throw new responseError(401, "Unauthorized");
    }
    req.userId = _id;
    next();
};

// export const authorize = (minimumAccessLevel) => {
//     return (req, res, next) => {
//         if (req.userAccessLevel < minimumAccessLevel) {
//             throw new Error("403:FORBIDDEN_ERROR");
//         }
//         next();
//     };
// };

export { authenticate };