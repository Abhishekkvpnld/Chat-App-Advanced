import { compare } from "bcrypt";
import { User } from "../models/userModel.js";
import { sendToken } from "../utils/webToken.js";
import { tryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chatModel.js";
import { Request } from "../models/requestModel.js";
import emitEvent from "../utils/emitEvent.js";
import { NEW_REQUEST, REFETCH_CHAT } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { uploadFilesToCloudinary } from "../utils/cloudinary.js";

//Create new user and save to database and save in cookie
export const newUser = tryCatch(async (req, res, next) => {

    const { name, username, password, bio } = req.body;

    const file = req.file;

    if (!file) return next(new ErrorHandler("Please Upload Avatar", 400));

    const result = await uploadFilesToCloudinary([file]);

    const avatar = {
        public_id: result[0].public_id,
        url: result[0].url
    };


    const user = await User.create({
        name: name,
        bio,
        username: username,
        password: password,
        avatar: avatar
    })

    sendToken(res, user, 201, "User created");
});


//login user and add token in cookie
export const logIn = tryCatch(async (req, res, next) => {

    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");

    if (!user)
        return next(new ErrorHandler("Invalid Username or Password", 404));

    const isMatch = await compare(password, user.password);

    if (!isMatch)
        return next(new ErrorHandler("Invalid Username or Password", 404));

    sendToken(res, user, 200, `login successfull, Welcome back ${user.name}`);

});


export const getMyProfile = tryCatch(async (req, res) => {
    const user = await User.findById(req.user);
    res.status(200).json({ success: true, user: user });
})


export const logout = tryCatch(async (req, res, next) => {

    const cookieOptions = {
        maxAge: 0,
        sameSite: "none",
        httpOnly: true,
        secure: true
    };

    return res.status(200).cookie("chat-token", "", cookieOptions).json({ success: true, message: "Logged out successfully..." });
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
        $or: [
            { sender: req.user, receiver: userId },
            { sender: userId, receiver: req.user }
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


export const acceptFriendRequest = tryCatch(async (req, res, next) => {

    const { requestId, accept } = req.body;

    const request = await Request.findById(requestId).populate("sender", "name").populate("receiver", "name");
    if (!request)
        return next(new ErrorHandler("Request Not Found", 404));

    if (request.receiver._id.toString() !== req.user.toString())
        return next(ErrorHandler("You are not authorized to accept this request", 401));

    if (!accept) {
        await request.deleteOne();

        res.status(200).json({
            success: true,
            message: "Friend Request Rejected"
        });
    };

    const members = [request.sender._id, request.receiver._id];

    await Promise.all([
        Chat.create({
            members,
            name: `${request.sender.name}-${request.receiver.name}`
        }),
        request.deleteOne(),
    ]);

    emitEvent(req, REFETCH_CHAT, members);

    return res.status(200).json({
        success: true,
        message: "Friend Request Accepted...",
        senderId: req.sender._id
    });
});//****************************************************************************************** */


export const getMyNotifications = tryCatch(async (req, res, next) => {
    const requests = await Request.find({ receiver: req.user }).populate("sender", "name avatar");

    const allRequests = requests.map(({ _id, sender }) => ({
        _id,
        sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar.url
        }
    }));
    return res.status(200).json({
        success: true,
        allRequests
    });

});


export const getMyFriends = tryCatch(async (req, res, next) => {

    const chatId = req.query.chatId;

    const chats = await Chat.find({
        members: req.user,
        groupChat: false
    }).populate("members", "name avatar");

    const friends = chats.map(({ members }) => {
        const otherUser = getOtherMember(members, req.user)

        return {
            _id: otherUser._id,
            name: otherUser.name,
            avatar: otherUser.avatar.url
        }
    })

    if (chatId) {

        const chat = await Chat.findById(chatId);

        const availableFriends = friends.filter(
            (friend) => !chat.members.includes(friend._id)
        );

        return res.status(200).json({
            success: true,
            friends: availableFriends
        })

    } else {

        return res.status(200).json({
            success: true,
            friends
        });

    };

});

