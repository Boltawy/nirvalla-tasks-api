import { db } from "../DB/db.connection.js";

const usersModel = db.collection("users");
export default usersModel