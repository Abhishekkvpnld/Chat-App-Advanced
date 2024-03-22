import { compare } from "bcrypt";
import { User } from "../models/userModel.js";
import { sendToken } from "../utils/webToken.js";
import { tryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";

//Create new user and save to database and save in cookie
export const newUser = async (req, res) => {

    const { name, username, password, bio } = req.body;
    console.log(req.body);

    const avatar = {
        public_id: "qwedad",
        url: "erwsfewfws"
    };
    const user = await User.create({
        name: name,
        bio,
        username: username,
        password: password,
        avatar: avatar
    })

    sendToken(res, user, 201, "User created");
}

//login user and add token in cookie
export const logIn = tryCatch(async (req, res, next) => {

    const { username, password } = req.body;
    console.log(username, password);

    const user = await User.findOne({ username }).select("+password");
    if (!user) return next(new ErrorHandler("Invalid Username or Password", 404))

    const isMatch = await compare(password, user.password);
    if (!isMatch) next(new ErrorHandler("Invalid Username or Password", 404))
    sendToken(res, user, 200, `login successfull, Welcome back ${user.name}`);

});

export const getMyProfile = async (req, res) => {
    const user = await User.findById(req.user);
    res.status(200).json({ success: true, data: user });
}

