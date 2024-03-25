
import { body, check, validationResult } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";


export const registerValidator = () => [

    body("name", "Please Enter Name").notEmpty(),
    body("username", "Please Enter Username").notEmpty(),
    body("password", "Please Enter Password").notEmpty(),
    body("bio", "Please Enter Bio").notEmpty(),
    check("avatar","Please Upload Avatar").notEmpty()

];

export const loginValidator = () => [

    body("username", "Please Enter Username").notEmpty(),
    body("password", "Please Enter Password").notEmpty(),

];

export const validateHandler = (req, res, next) => {

    const error = validationResult(req);

    const errorMessages = error.array().map((error)=>error.msg).join(",")

    if(error.isEmpty()) return next()
    else return next(new ErrorHandler(errorMessages,400))

};