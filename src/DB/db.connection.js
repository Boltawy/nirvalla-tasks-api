import mongoose from "mongoose";


const establishDBConnection = () => {
    mongoose.connect(`${process.env.DBURL}/${process.env.DBNAME}`)
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.error("Error connecting to MongoDB"));
}

export default establishDBConnection;