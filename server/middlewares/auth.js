import { ErrorHandler } from "../utils/utility.js";
import { tryCatch } from "./error.js";
import Jwt from "jsonwebtoken";

export const isAuthenticated = tryCatch(async (req, res, next) => {
    const token = req.cookies["chat-token"];

    if (!token) return next(new ErrorHandler("Please login to access this route", 401))

    const decodedData = Jwt.verify(token,process.env.JWT_SECRET);
    console.log(decodedData);

    req.user = decodedData._id;

    next();
})