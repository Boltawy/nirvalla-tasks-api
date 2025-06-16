import { MongoClient } from "mongodb";
import { configDotenv } from 'dotenv';
configDotenv({ path: './config.env' });

const client = new MongoClient(process.env.DBURL);
const db = client.db(process.env.DBNAME);

const establishDBConnection = async () => {
  try {
    await client.connect();
    console.log("Connected to DB.");
  } catch (error) {
    console.error("Error connecting to DB:", error);
  }
};

export { db, establishDBConnection };
