import { responseError } from "./errorHandler.js";

/**
 * Safely performs a findOne operation on a Mongoose model.
 * @param {model} modelName - The Mongoose model to perform the operation on.
 * @param {Object} data - The data to query the model with.
 * @param {string} [errMessage="Error reading from database"] - The error message to use if the operation fails.
 * @returns {Promise<document>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeFindOne = async (modelName, data, errMessage = "Error reading from database") => {
    let result;
    try {
        result = await modelName.findOne(data);
    } catch (error) {
        throw new responseError(500, errMessage, error)
    }
    return result;
}

/**
 * Safely performs a findOneById operation on a Mongoose model.
 * @param {model} modelName - The Mongoose model to perform the operation on.
 * @param {string} id - The id of the document to query for.
 * @param {string} [errMessage="Error reading from database"] - The error message to use if the operation fails.
 * @returns {Promise<document>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeFindOneById = async (modelName, id, errMessage = "Error reading from database") => {
    let result;
    try {
        result = await modelName.findById(id);
    } catch (error) {
        throw new responseError(500, errMessage, error)
    }
    return result;
}

/**
 * Safely performs a find operation on a Mongoose model.
 * @param {model} modelName - The Mongoose model to perform the operation on.
 * @param {Object} data - The data to query the model with.
 * @param {string} [errMessage="Error reading from database"] - The error message to use if the operation fails.
 * @returns {Promise<document[]>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeFind = async (modelName, data, errMessage = "Error reading from database") => {
    let result;
    try {
        result = await modelName.find(data);
    } catch (error) {
        throw new responseError(500, errMessage, error)
    }
    return result;
}

/**
 * Safely performs a create operation on a Mongoose model.
 * @param {model} modelName - The Mongoose model to perform the operation on.
 * @param {Object} data - The data to create a new document with.
 * @param {string} [errMessage="Error creating in database"] - The error message to use if the operation fails.
 * @returns {Promise<document>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeCreate = async (modelName, data, errMessage = "Error creating in database") => {
    let result;
    try {
        result = await modelName.create(data);
    } catch (error) {
        throw new responseError(500, errMessage, error)
    }
    return result;
}

/**
 * Safely performs an update operation on a Mongoose model.
 * @param {model} modelName - The Mongoose model to perform the operation on.
 * @param {Object} data - The data to update the document with.
 * @param {string} [errMessage="Error updating in database"] - The error message to use if the operation fails.
 * @returns {Promise<updateResult>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeUpdate = async (modelName, data, errMessage = "Error updating in database") => {
    let result;
    try {
        result = await modelName.updateOne(data);
    } catch (error) {
        throw new responseError(500, errMessage, error)
    }
    return result;
}


