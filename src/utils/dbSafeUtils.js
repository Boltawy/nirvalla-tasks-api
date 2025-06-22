import mongoose, { mongo } from "mongoose";
import userModel from "../models/user.model.js";
import { responseError } from "./errorHandler.js";

/**
 * Safely performs a findOne operation on a Mongoose model.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {Object} data - The data to query the model with.
 * @param {string} [errMessage="Error reading from database"] - The error message to use if the operation fails.
 * @returns {Promise<mongoose.Document>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeFindOne = async (model, data, errMessage) => {
    const { modelName } = model;
    try {
        const result = await model.findOne(data);
        if (!result) throw new responseError(404, `${modelName} not found`);
        return result;
    } catch (error) {
        throw new responseError(500, `Error reading ${modelName} from database` || errMessage, error);
    }
};

/**
 * Safely performs a findById operation on a Mongoose model.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {string} id - The id of the document to query for.
 * @param {string} [errMessage="Error reading from database"] - The error message to use if the operation fails.
 * @returns {Promise<mongoose.Document>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeFindById = async (model, id, errMessage) => {
    const { modelName } = model;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new responseError(400, `Invalid ID format for ${modelName}`);
    let result;
    try {
        result = await model.findById(id);
        if (!result) throw new Error();
        console.log(result)
        return result;
    } catch (error) {
        if (!result) throw new responseError(404, `${modelName} not found`);
        else throw new responseError(500, `Error reading ${modelName} from database` || errMessage, error);
    }
};

/**
 * Safely performs a find operation on a Mongoose model.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {Object} data - The data to query the model with.
 * @param {string} [errMessage="Error reading from database"] - The error message to use if the operation fails.
 * @returns {Promise<mongoose.Document[]>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeFind = async (model, data, errMessage) => {
    const { modelName } = model;
    try {
        const result = await model.find(data);
        if (!result.length) throw new responseError(404, `${modelName} not found`);
        return result;
    } catch (error) {
        throw new responseError(500, `Error reading ${modelName} from database` || errMessage, error);
    }
};

/**
 * Safely performs a create operation on a Mongoose model.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {Object} data - The data to create a new document with.
 * @param {string} [errMessage="Error creating in database"] - The error message to use if the operation fails.
 * @returns {Promise<mongoose.Document>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeCreate = async (model, data, errMessage) => {
    const { modelName } = model;
    try {
        const result = await model.create(data);
        return result;
    } catch (error) {
        throw new responseError(500, errMessage || `Error creating ${modelName} in database`, error);
    }
};

/**
 * Safely performs an update operation on a Mongoose model.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {Object} filter - The filter to apply to find the document to update.
 * @param {Object} updateData - The data to update the document with.
 * @param {string} [errMessage="Error updating in database"] - The error message to use if the operation fails.
 * @returns {Promise<mongoose.UpdateWriteOpResult>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeUpdate = async (model, filter, updateData, errMessage) => {
    const { modelName } = model;
    try {
        const result = await model.updateOne(filter, updateData);
        return result;
    } catch (error) {
        throw new responseError(500, errMessage || `Error updating ${modelName} in database`, error);
    }
};

/**
 * Safely performs an update operation on a Mongoose model by Id, validating the update data.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {string} id - The id of the document to update.
 * @param {Object} updateData - The data to update the document with.
 * @param {string} [errMessage="Error updating in database"] - The error message to use if the operation fails.
 * @returns {Promise<mongoose.Document>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeUpdateById = async (model, id, updateData, errMessage) => {
    const { modelName } = model;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new responseError(400, `Invalid ID format for ${modelName}`);
    try {
        const result = await model.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!result) throw new responseError(404, `${modelName} not found`);
        return result;
    } catch (error) {
        throw new responseError(500, errMessage || `Error updating ${modelName} in database`, error);
    }
};

/**
 * Safely performs a delete operation on a Mongoose model.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {Object} filter - The filter to apply to find the document to delete.
 * @param {string} [errMessage="Error deleting from database"] - The error message to use if the operation fails.
 * @returns {Promise<mongoose.DeleteResult>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeDelete = async (model, filter, errMessage) => {
    const { modelName } = model;
    try {
        const result = await model.deleteOne(filter);
        return result;
    } catch (error) {
        throw new responseError(500, errMessage || `Error deleting ${modelName} from database`, error);
    }
};

/**
 * Safely performs a delete operation on a Mongoose model by Id, validates the id.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {string} id - The id of the document to delete.
 * @param {string} [errMessage="Error deleting from database"] - The error message to use if the operation fails.
 * @returns {Promise<mongoose.Document>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeDeleteById = async (model, id, errMessage) => {
    const { modelName } = model;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new responseError(400, `Invalid ID format for ${modelName}`);
    try {
        const result = await model.findByIdAndDelete(id);
        return result;
    } catch (error) {
        throw new responseError(500, errMessage || `Error deleting ${modelName} from database`, error);
    }
};




