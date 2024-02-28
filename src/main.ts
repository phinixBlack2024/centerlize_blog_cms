import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser"
const app = express()

app.use(
    cors({
        origin: "*", // Use process.env.CORS_URL without quotes
        credentials: true,
    })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRoute from "./routes/user.route"
app.use('/app/v1/user',userRoute);
module.exports = app