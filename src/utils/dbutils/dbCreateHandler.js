import { model } from "mongoose";


const dbCreateHandler = (modelName, data) => {
    try {
        model(modelName).create(data);
    } catch (error) {
        throw new responseError(500, "Error creating in database", error)
    }
}
export default dbCreateHandler
