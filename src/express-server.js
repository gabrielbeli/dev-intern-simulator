import express from "express";
import { internRoutes } from "./routes/internRoutes.js";

const app = express();

app.use(express.json());

app.use("/intern", internRoutes);

app.listen(3000, () => {
    console.log("Express server running on port 3000");
});

