import { envMode } from "../app.js";


export const errorMiddleware = (err, req, res, next) => {

    err.message ||= "Internal Server Error";
    err.statusCode ||= 500;


    if(err.code === 11000){
        const error = Object.keys(err.keyPattern).join(",");
        err.message = `Duplicate field - ${error}`;
        err.statusCode = 400;
    };

    if(err.name === "castError"){
        const errorPath = err.path;
        err.message = `Invalid Format of ${errorPath}`,
        err.statusCode = 400
    };


    return res.status(err.statusCode).json({
        success: false,
        message: envMode === "DEVELOPMENT" ? err : err.message
    });

};

export const tryCatch = (passedFunction) => async (req, res, next) => {
    try {
        await passedFunction(req, res, next);
    } catch (error) {
        next(error);
    }

};