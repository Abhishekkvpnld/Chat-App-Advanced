import { compare } from "bcrypt";
import { User } from "../models/userModel.js";
import { sendToken } from "../utils/webToken.js";
import { tryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chatModel.js";
import { Request } from "../models/requestModel.js";
import emitEvent from "../utils/emitEvent.js";
import { NEW_REQUEST } from "../constants/events.js";

//Create new user and save to database and save in cookie
export const newUser = async (req, res) => {

    const { name, username, password, bio } = req.body;

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

    const user = await User.findOne({ username }).select("+password");
    if (!user) return next(new ErrorHandler("Invalid Username or Password", 404))

    const isMatch = await compare(password, user.password);
    if (!isMatch) next(new ErrorHandler("Invalid Username or Password", 404))
    sendToken(res, user, 200, `login successfull, Welcome back ${user.name}`);

});


export const getMyProfile = tryCatch(async (req, res) => {
    const user = await User.findById(req.user);
    res.status(200).json({ success: true, data: user });
})


export const logout = tryCatch(async (req, res) => {

    const cookieOptions = {
        maxAge: 0,
        sameSite: "none",
        httpOnly: true,
        secure: true
    };

    return res.status(200).cookie("chat-token", "", cookieOptions).json({ success: true, data: "Logged out successfully..." });
});


export const searchUser = tryCatch(async (req, res) => {
    const { name = "" } = req.query;

    //Finding all my chats
    const myChats = await Chat.find({ groupChat: false, members: req.user });

    // Extracting all users from my chats means friends or people I have chatted with
    const allUsersfromMyChat = myChats.flatMap((chat) => chat.members);

    const allUsersExceptMeAndFriends = await User.find({
        _id: { $nin: allUsersfromMyChat },
        name: { $regex: name, $options: "i" }
    });

    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar.url
    }))



    res.status(201).json({
        success: true,
        users
    });
}
);


export const sendFriendRequest = tryCatch(async (req, res, next) => {

    const { userId } = req.body;

    const request = await Request.findOne({
        $or:[
            {sender:req.user,receiver:userId},
            {sender:userId,receiver:req.user}
        ]
    });

    if (request) return next(new ErrorHandler("Request already sent", 400));

    await Request.create({
        sender: req.user,
        receiver: userId
    });

    emitEvent(req, NEW_REQUEST, [userId]);

    return res.status(200).json({
        success: true,
        message: "Friend Request Send..."
    });
});
