import { ErrorHandler } from "../utils/utility.js";
import Jwt from "jsonwebtoken";
import { adminSecretKey } from "../app.js";
import { tryCatch } from "./error.js";
import { chatToken } from "../constants/config.js";
import { User } from "../models/userModel.js";

export const isAuthenticated = tryCatch(async (req, res, next) => {
    const token = req.cookies[chatToken];

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

    if (!isMatched)
        return next(new ErrorHandler("Only Admin Can Access This Route", 401));

    next();
};


export const socketAuthenticator = async (err, socket, next) => {
    try {
        if (err) next(err);

        const authToken = socket.request.cookies[chatToken];

        if (!authToken)
            next(new ErrorHandler("Please login to access this route", 401));

        const decodedData = Jwt?.verify(authToken, process.env.JWT_SECRET);

        const user = await User.findById(decodedData._id);

        if (!user)
            next(new ErrorHandler("Please login to access this route", 401));

        socket.user = user;

        return next();

    } catch (error) {
        console.log(error);
        next(new ErrorHandler("Please login to access this route", 401));
    };
};