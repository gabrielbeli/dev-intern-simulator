import "dotenv/config";
import { MongoClient } from "mongodb";

let database

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToDatabase() {

    await client.connect();

    database = client.db("dev_intern_simulator");

    console.log("Connected to MongoDB");
}

export function getDatabase() {

    if (!database) {
        throw new Error("Database is not connected");
    }

    return database;
}

export function getDatabaseClient() {
    return client;
}