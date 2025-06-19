import mongoose from "mongoose";


const establishDBConnection = () => {
    mongoose.connect(`${process.env.DBURL}/${process.env.DBNAME}`)
        .then(() => console.log("Connected to DB"))
        .catch((err) => console.error("Error connecting to DB"));
}

export default establishDBConnection;