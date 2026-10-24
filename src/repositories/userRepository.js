import { ObjectId } from "mongodb";
import { getDatabase } from "../config/database.js";
import { User } from "../models/User.js";

function toUser(data) {
    if (!data) {
        return null;
    }

    return new User(
        data._id,
        data.email,
        data.passwordHash,
        data.createdAt
    );
}

export async function findUserById(userId) {
    const database = getDatabase();

    const users = database.collection("users");

    const data = await users.findOne({
        _id: new ObjectId(userId)
    });

    return toUser(data);
}

export async function findUserByEmail(email) {
    const database = getDatabase();

    const users = database.collection("users");

    const normalizedEmail =
        email.trim().toLowerCase();

    const data = await users.findOne({
        email: normalizedEmail
    });

    return toUser(data);
}

export async function saveUser(user) {
    const database = getDatabase();

    const users = database.collection("users");

    const userData = {
        email: user.email,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt
    };

    if (!user.id) {
        const result = await users.insertOne(
            userData
        );

        user.id = result.insertedId;

        return user;
    }

    await users.updateOne(
        {
            _id: user.id
        },
        {
            $set: userData
        }
    );

    return user;
}