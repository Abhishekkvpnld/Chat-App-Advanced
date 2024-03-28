import { ErrorHandler } from "../utils/utility.js";
import Jwt from "jsonwebtoken";
import {adminSecretKey} from "../app.js";
import { tryCatch } from "./error.js";

export const isAuthenticated = tryCatch(async (req, res, next) => {
    const token = req.cookies["chat-token"];

    if (!token)
        return next(new ErrorHandler("Please login to access this route", 401))

    const decodedData = Jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedData._id;

    next();
});


export const adminOnly = async (req, res, next) => {
    const token = req.cookies["chat-admin-token"];

    if (!token)
        return next(new ErrorHandler("Only Admin Can Access This Route", 401))

    const secretKey = Jwt.verify(token, process.env.JWT_SECRET);

    const isMatched = secretKey === adminSecretKey;

    if(!isMatched)
    return next(new ErrorHandler("Only Admin Can Access This Route", 401));

    next();
}