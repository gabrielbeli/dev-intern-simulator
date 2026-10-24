import { connectToDatabase } from "../config/database.js";
import { registerUser } from "../services/authService.js";

async function registerUserDemo() {
    try {
        await connectToDatabase();

        const email =
            process.env.DEMO_USER_EMAIL;

        const password =
            process.env.DEMO_USER_PASSWORD;

        if (!email || !password) {
            throw new Error(
                "Demo credentials are not configured"
            );
        }

        const user = await registerUser(
            email,
            password
        );

        console.log(
            "User registered successfully"
        );

        console.log("User id:", user.id);
        console.log("Email:", user.email);
        console.log(
            "Password hash:",
            user.passwordHash
        );
    } catch (error) {
        console.error(
            "Could not register user:",
            error.message
        );
    }
}

registerUserDemo();