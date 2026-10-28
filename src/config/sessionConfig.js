import "dotenv/config";

import session from "express-session";
import MongoStore from "connect-mongo";

if (!process.env.SESSION_SECRET) {
    throw new Error(
        "SESSION_SECRET is not configured"
    );
}

if (!process.env.MONGODB_URI) {
    throw new Error(
        "MONGODB_URI is not configured"
    );
}

export const sessionMiddleware = session({
    name: "devIntern.sid",

    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        dbName: "dev_intern_simulator",
        collectionName: "sessions"
    }),

    cookie: {
        httpOnly: true,
        sameSite: "lax",

        secure:
            process.env.NODE_ENV === "production",

        maxAge:
            1000 * 60 * 60 * 24 * 7
    }
});