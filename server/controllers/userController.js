import { User } from "../models/userModel.js";
import { sendToken } from "../utils/webToken.js";

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

    sendToken(res,user,201,"User created");
}

export const logIn = (req, res) => {
    res.send("user login")
}

