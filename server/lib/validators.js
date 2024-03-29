
import { body, validationResult, param } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

export const validateHandler = (req, res, next) => {

    const error = validationResult(req);

    const errorMessages = error.array().map((error) => error.msg).join(",")

    if (error.isEmpty()) return next()
    else return next(new ErrorHandler(errorMessages, 400))

};


export const registerValidator = () => [
    body("name", "Please Enter Name").notEmpty(),
    body("username", "Please Enter Username").notEmpty(),
    body("password", "Please Enter Password").notEmpty(),
    body("bio", "Please Enter Bio").notEmpty(),
];


export const loginValidator = () => [
    body("username", "Please Enter Username").notEmpty(),
    body("password", "Please Enter Password").notEmpty(),
];


export const sendRequestValidator = () => [
    body("userId", "Please Enter User Id").notEmpty(),
];


export const acceptRequestValidator = () => [
    body("requestId", "Please Enter Request Id").notEmpty(),
    body("accept").notEmpty().withMessage( "Please Add Accept").isBoolean().withMessage("Acccept must be a boolean")
];



export const newGroupChatValidator = () => [
    body("name", "Please Enter Name").notEmpty(),
    body("members").notEmpty().withMessage("Please Enter Members")
        .isArray({ min: 2, max: 100 }).withMessage("Members must be 2-100")
];


export const addMemberValidator = () => [
    body("chatId", "Please Enter chat ID").notEmpty(),
    body("members").notEmpty().withMessage("Please Enter Members")
        .isArray({ min: 1, max: 97 }).withMessage("Members must be 1-97")
];


export const removeMemberValidator = () => [
    body("chatId", "Please Enter Chat ID").notEmpty(),
    body("userId", "Please Enter User ID").notEmpty(),
];


export const chatIdValidator = () => [
    param("id", "Please Enter Chat ID").notEmpty()
];


export const sendAttachmentsValidator = () => [
    body("chatId", "Please Enter Chat ID").notEmpty(),
];

export const renameGroupValidator = () => [
    param("id", "Please Enter Chat ID").notEmpty(),
    body("name", "Please Enter New Name").notEmpty()
];


//Admin validators 

export const adminLoginValidator = () => [
    body("secretKey", "Please Enter Secret Key").notEmpty(),
];



