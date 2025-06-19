import { model } from "mongoose";
import { responseError } from "../errorHandler.js";

const safeFindOne = async (modelName, data) => {
    let result;
    try {
        result = await modelName.findOne(data);
    } catch (error) {
        throw new responseError(500, "Error reading from database", error)
    }
    return result;
}

const safeFind = async (modelName, data) => {
    let result;
    try {
        result = await modelName.find(data);
    } catch (error) {
        throw new responseError(500, "Error reading from database", error)
    }
    return result;
}
const safeCreate = async (modelName, data) => {
    let result;
    try {
        result = await modelName.create(data);
    } catch (error) {
        throw new responseError(500, "Error creating in database", error)
    }
    return result;
}

const safeUpdate = async (modelName, data) => {
    let result;
    try {
        result = await modelName.updateOne(data);
    } catch (error) {
        throw new responseError(500, "Error updating in database", error)
    }
    return result;
}

// const dbSafeOperation = async (modelName, operation, errMessage, [...data]) => {
//     let result;
//     try {
//         result = await modelName[operation](...data);
//     } catch (error) {
//         throw new responseError(500, errMessage, error)
//     }
//     return result;
// }



export { safeCreate, safeFindOne, safeUpdate, safeFind }
