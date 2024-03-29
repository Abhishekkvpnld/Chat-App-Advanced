import { tryCatch } from "../middlewares/error.js";
import jwt from "jsonwebtoken";
import { Chat } from "../models/chatModel.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";
import { ErrorHandler } from "../utils/utility.js";
import { cookieOptions } from "../utils/webToken.js"


export const adminLogin = tryCatch(async (req, res, next) => {

    const { secretKey } = req.body;

    const adminSecretKey = process.env.ADMIN_SECRET_KEY || "adminauthentication";

    const isMatched = secretKey === adminSecretKey;

    if (!isMatched)
        return next(new ErrorHandler("Invalid Admin Key", 401));

    const token = jwt.sign(secretKey, process.env.JWT_SECRET);

    return res.status(200)
        .cookie("chat-admin-token", token, { ...cookieOptions, maxAge: 1000 * 60 * 10 })
        .json({
            success: true,
            message: "Authenticated Successfully,Welcome Back..."
        });
});


export const adminLogout = tryCatch(async (req, res, next) => {

    return res.status(200)
        .cookie("chat-admin-token", "", {
            ...cookieOptions,
            maxAge: 0
        })
        .json({
            success: true,
            message: "Logged Out Successfully"
        })
});


export const getAdminData = tryCatch(async(req,res,next)=>{

    return res.status(200).json({
        admin:true
    })
});


export const allUsers = tryCatch(async (req, res, next) => {

    const users = await User.find({});

    const transformUsers = await Promise.all(
        users.map(async ({ name, username, avatar, _id }) => {
            const [groups, friends] = await Promise.all([
                Chat.countDocuments({ groupChat: true, members: _id }),
                Chat.countDocuments({ groupChat: false, members: _id })
            ])
            return {
                name,
                username,
                avatar: avatar.url,
                _id,
                groups,
                friends
            }
        }))
    return res.status(200).json({
        success: true,
        transformUsers
    })
});


export const allChats = tryCatch(async (req, res) => {

    const chats = await Chat.find({})
        .populate("members", "name avatar")
        .populate("creator", "name avatar");

    const transformedChats = await Promise.all(chats.map(async ({ members, _id, groupChat, name, creator }) => {

        const totalMessages = await Message.countDocuments({ chat: _id });

        return {
            _id,
            groupChat,
            name,
            avatar: members.slice(0, 3).map((member) => member.avatar.url),
            members: members.map(({ _id, name, avatar }) => ({
                _id,
                avatar: avatar.url,
                name
            })),
            creator: {
                name: creator?.name || "none",
                avatar: creator?.avatar.url || ""
            },
            totalMembers: members.length,
            totalMessages
        };
    }));

    return res.status(200).json({
        success: true,
        transformedChats
    })

});


export const allMessages = tryCatch(async (req, res) => {

    const messages = await Message.find({})
        .populate("sender", "name avatar")
        .populate("chat", "groupChat");

    const transformMessages = messages.map(({ content, attachments, _id, sender, createdAt, chat }) => ({
        _id,
        content,
        attachments,
        createdAt,
        chat: chat._id,
        groupChat: chat.groupChat,
        sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar.url
        }
    }))

    return res.status(200).json({
        success: true,
        messages: transformMessages
    });

});


export const getDashboardStats = tryCatch(async (req, res) => {

    const [groupsCount, usersCount, messagesCount, totalChatsCount] = await Promise.all([
        Chat.countDocuments({ groupChat: true }),
        User.countDocuments(),
        Message.countDocuments(),
        Chat.countDocuments()
    ]);

    const today = new Date();

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const last7DaysMessages = await Message.find({
        createdAt: {
            $gte: last7Days,
            $lte: today
        }
    }).select("createdAt");

    const messages = new Array(7).fill(0);
    const dayInMilliSeconds = 1000 * 60 * 60 * 24;

    last7DaysMessages.forEach((message) => {
        const indexApprox = (today.getTime() - message.createdAt.getTime()) / dayInMilliSeconds;

        const index = Math.floor(indexApprox);

        messages[6 - index]++;
    });


    const stats = {
        groupsCount,
        usersCount,
        messagesCount,
        totalChatsCount,
        messagesChart: messages
    };


    return res.status(200).json({
        success: true,
        stats
    })
});