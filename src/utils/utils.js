import mongoose, { isValidObjectId } from "mongoose"

export function assignIds(items) {
    return items.map((item) => {
        if (isValidObjectId(item._id)) {
            return item
        }
        else return { ...item, _id: new mongoose.Types.ObjectId() }
    })
}
