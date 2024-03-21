import { compare } from "bcrypt";
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

    sendToken(res, user, 201, "User created");
}

export const logIn = async (req, res) => {

    const { username, password } = req.body;
    console.log(username, password);

    const user = await User.findOne({ username }).select("+password");
    if (!user) {
        return res.status(400).json({ message: "Invalid Username" });
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid Password" });
    } 
    sendToken(res, user, 200, `login successfull, Welcome back ${user.name}`);
}

