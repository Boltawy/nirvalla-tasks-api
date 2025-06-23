import mongoose, { mongo } from "mongoose";
import { responseError } from "./errorHandler.js";
//TODO Options object for all functions


/**
 * Safely performs a findOne operation on a Mongoose model.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {Object} filter - The filter to apply to find the document.
 * @param {Object} [options] - Options for the operation.
 * @param {string} [options.errMessage] - The error message to use if the operation fails.
 * @param {boolean} [options.errOnNotFound=false] - Whether to throw an error if no document is found.
 * @param {Object} [options.projection] - The projection to apply to the found document.
 * @returns {Promise<mongoose.Document>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeFindOne = async (model, filter, options = {}) => {
    const { errMessage, errOnNotFound = true, projection } = options;
    const { modelName } = model;
    let result;
    try {
        result = await model.findOne(filter, projection);
        if (!result && errOnNotFound) throw new Error();
        return result;
    } catch (error) {
        if (!result && errOnNotFound) throw new responseError(404, `${modelName} not found`);
        throw new responseError(500, errMessage || `Error reading ${modelName} from database`, error);
    }
};


/**
 * Safely performs a findById operation on a Mongoose model.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {string} id - The id of the document to find.
 * @param {Object} [options] - Options for the operation.
 * @param {string} [options.errMessage] - The error message to use if the operation fails.
 * @param {boolean} [options.errOnNotFound=false] - Whether to throw an error if no document is found.
 * @param {Object} [options.projection] - The projection to apply to the found document.
 * @returns {Promise<mongoose.Document>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeFindById = async (model, id, options = {}) => {
    const { errMessage, errOnNotFound = true, projection } = options;
    const { modelName } = model;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new responseError(400, `Invalid ID format for ${modelName}`);
    let result;
    try {
        result = await model.findById(id, projection);
        if (!result & errOnNotFound) throw new responseError(404, `${modelName} not found`);
        return result;
    } catch (error) {
        if (error instanceof responseError) throw error;
        else throw new responseError(500, errMessage || `Error reading ${modelName} from database`, error);
    }
};

/**
 * Finds a document by its ID and verifies that the user has access to it.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {string} itemId - The id of the document to find.
 * @param {string} userId - The id of the user to verify access for.
 * @returns {Promise<mongoose.Document>} The document if the user has access.
 * @throws {responseError} If the user does not have access, or if the operation fails.
 */
export const findByIdAndVerifyOwner = async (model, itemId, userId) => { //Not Abstract
    if (!mongoose.Types.ObjectId.isValid(userId)) throw new responseError(400, `Invalid ID format for userId`);
    const item = await safeFindById(model, itemId);
    if (item.userId != userId) throw new responseError(403, "Unauthorized: You don't have access to that resource");
    return item;
}



/**
 * Safely performs a find operation on a Mongoose model.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {Object} filter - The filter to apply to find the documents.
 * @param {Object} [options] - Options for the operation.
 * @param {string} [options.errMessage] - The error message to use if the operation fails.
 * @param {boolean} [options.errOnNotFound=false] - Whether to throw an error if no documents are found.
 * @param {Object} [options.projection] - The projection to apply to the found documents.
 * @param {Object} [options.sort] - The sort order to apply to the found documents.
 * @returns {Promise<mongoose.Document[]>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */

export const safeFind = async (model, filter, options = {}) => {
    const { errMessage, errOnNotFound, projection = {}, sort = null } = options;
    const { modelName } = model;
    let result;
    try {
        result = await model.find(filter, projection).sort(sort);
        if (result.length == 0 && errOnNotFound) throw new responseError(404, `No ${modelName}s found`);
        return result;
    } catch (error) {
        if (error instanceof responseError) throw error;
        throw new responseError(500, errMessage || `Error reading ${modelName}s from database`, error);
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
        const result = await model.updateOne(filter, updateData, { new: true, runValidators: true });
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
        if (error instanceof responseError) throw error;
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




