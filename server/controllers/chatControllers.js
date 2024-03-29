import { tryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chatModel.js";
import emitEvent from "../utils/emitEvent.js";
import { ALERT, NEW_ATTACHMENT, NEW_MESSAGE_ALLERT, REFETCH_CHAT } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { User } from "../models/userModel.js";
import { Message } from "../models/messageModel.js";
import {deleteFileFromCloudinary} from "../utils/cloudinary.js";



export const newGroupChat = tryCatch(async (req, res, next) => {
    const { name, members } = req.body;

    if (members.length < 2) return next(new ErrorHandler("Group must have atleast 3 members", 400));

    const allMembers = [...members, req.user];

    await Chat.create({
        name,
        groupChat: true,
        creator: req.user,
        members: allMembers
    });

    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
    emitEvent(req, REFETCH_CHAT, members);

    return res.status(201).json({
        success: true,
        message: "Group Created..."
    });
})

export const getMyChats = tryCatch(async (req, res, next) => {

    const chats = await Chat.find({ members: req.user }).populate("members", "name avatar");

    const transformChat = chats.map(({ _id, name, members, groupChat }) => {
        return {
            _id,
            groupChat,
            avatar: groupChat ? members.slice(0, 3).map(({ avatar }) => avatar.url) : [getOtherMember.avatar.url],
            name: groupChat ? name : getOtherMember.name,
            members: members.reduce((prev, curr) => {
                if (curr._id.toString() !== req.user.toString()) {
                    prev.push(curr._id);
                }
                return prev;
            }, [])

        }
    });

    return res.status(201).json({
        success: true,
        message: transformChat,
    });
});


export const getMyGroups = tryCatch(async (req, res, next) => {
    const chats = await Chat.find({

        members: req.user,
        groupChat: true,
        creator: req.user,

    }).populate("members", "name avatar");

    const groups = chats.map(({ members, _id, groupChat, name }) => (
        {
            _id,
            groupChat,
            name,
            avatar: members.slice(0, 3).map(({ avatar }) => avatar.url)
        }
    ))
    return res.status(200).json({
        success: true,
        groups
    })
});


export const addMembers = tryCatch(async (req, res, next) => {
    const { chatId, members } = req.body;

    if (!members || members.length < 1)
        return next(new ErrorHandler("Please provide members", 400))

    const chat = await Chat.findById(chatId);

    if (!chat)
        return next(new ErrorHandler("Chat not found", 404));

    if (!chat.groupChat)
        return next(new ErrorHandler("This is not a group chat", 404));

    if (chat.creator.toString() !== req.user.toString())
        return next(new ErrorHandler("You are not allowed to add members", 403));

    const allMembersPromise = members.map((i) => User.findById(i, "name"));

    const allNewMembers = await Promise.all(allMembersPromise);

    const uniqueMembers = allNewMembers.filter((i) => !chat.members.includes(i._id.toString())).map((i) => i._id);

    chat.members.push(...uniqueMembers.map((i) => i._id));

    if (chat.members.length > 100)
        return next(new ErrorHandler("Group members limit reached", 400));

    await chat.save();

    const allUsersName = allNewMembers.map((i) => i.name).join(",");

    emitEvent(
        req,
        ALERT,
        chat.members,
        `${allUsersName} has been added in this group`
    );

    emitEvent(req, REFETCH_CHAT, chat.members);

    res.status(200).json({
        success: true,
        message: "Members added successfully"

    })
})


export const removeMembers = tryCatch(async (req, res, next) => {

    const { userId, chatId } = req.body;

    const [chat, userThatWillBeRemoved] = await Promise.all([
        Chat.findById(chatId),
        User.findById(userId, "name")
    ]);

    if (!chat)
        return next(new ErrorHandler("Chat not found", 404));

    if (!chat.groupChat)
        return next(new ErrorHandler("This is not a group chat", 404));

    if (chat.creator.toString() !== req.user.toString())
        return next(new ErrorHandler("You are not allowed to add members", 403));

    if (chat.members.length <= 3)
        return next(new ErrorHandler("Group must have at least 3 members", 400));

    chat.members = chat.members.filter((member) => member.toString() !== userId.toString());

    await chat.save();


    emitEvent(
        req,
        ALERT,
        chat.members,
        `${userThatWillBeRemoved.name} has been removed from the group`
    );

    emitEvent(req, REFETCH_CHAT, chat.members);

    return res.status(200).json({
        success: true,
        message: "Member removed successfully"
    })

});


export const leaveGroup = tryCatch(async (req, res, next) => {

    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);

    if (!chat)
        return next(new ErrorHandler("Chat not found", 404));

    if (!chat.groupChat)
        return next(new ErrorHandler("This is not a group chat", 400));

    const remainingMembers = chat.members.filter((member) => member.toString() !== req.user.toString());

    if (remainingMembers.length < 3)
        return next(new ErrorHandler("Group must have at least 3 members", 400));

    if (chat.creator.toString() === req.user.toString()) {
        const randomElement = Math.floor(Math.random() * remainingMembers.length);

        const newCreator = remainingMembers[randomElement];
        chat.creator = newCreator;
    }

    chat.members = remainingMembers;
    const [user] = Promise.all([
        User.findById(req.user, "name"),
        chat.save()
    ])

    emitEvent(
        req,
        ALERT,
        chat.members,
        `User ${user.name} has left the group`
    );


    return res.status(200).json({
        success: true,
        message: "Member removed successfully"
    })

})


export const sendAttachments = tryCatch(async (req, res, next) => {

    const { chatId } = req.body;

    const files = req.files || [];

    if (files.length < 1)
        return next(new ErrorHandler("Please Upload Attachments", 400));

    if (files.length > 5)
        return next(new ErrorHandler("Files Can't be more than 5", 400));

    const [chat, me] = await Promise.all([
        Chat.findById(chatId),
        User.findById(req.user, "name")
    ]);

    if (!chat)
        return next(new ErrorHandler("Chat not found", 404));


    //Upload file here
    const attachments = [];

    const messageForDB = {
        content: "",
        attachments,
        sender: me._id,
        chat: chatId
    };

    const messageForRealTime = {
        ...messageForDB,
        sender: {
            _id: me._id,
            name: me.name,
        },

    };

    const message = await Message.create(messageForDB);

    emitEvent(req, NEW_ATTACHMENT, chat.members, {
        message: messageForRealTime,
        chatId
    });

    emitEvent(req, NEW_MESSAGE_ALLERT, chat.members, { chatId })

    res.status(200).json({
        success: true,
        message
    })
})


export const getChatDetails = tryCatch(async (req, res, next) => {

    if (req.query.populate === "true") {

        const chat = await Chat.findById(req.params.id).populate("members", "name avatar").lean();

        if (!chat) return next(new ErrorHandler("Chat not found", 404));

        chat.members = chat.members.map(({ _id, name, avatar }) => (
            {
                _id,
                name,
                avatar: avatar.url
            }
        ))

        res.status(200).json({
            success: true,
            chat
        })

    } else {

        const chat = await Chat.findById(req.params.id);
        if (!chat) return next(new ErrorHandler("Chat not found", 404))

        res.status(200).json({
            success: true,
            chat
        })

    }
})


export const renameGroup = tryCatch(async (req, res, next) => {

    const chatId = req.params.id;
    const { name } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat)
        return next(new ErrorHandler("Chat not found", 404));

    if (!chat.groupChat)
        return next(new ErrorHandler("This is not a group chat", 400));

    if (chat.creator.toString() !== req.user.toString())
        return next(new ErrorHandler("You are not allowed to rename the group", 403));

    chat.name = name;

    chat.save();

    emitEvent(req, REFETCH_CHAT, chat.members);

    return res.status(200).json({
        success: true,
        message: "Group renamed successfully..."
    });

});


export const getMessages = tryCatch(async (req, res, next) => {

    const chatId = req.params.id;
    const { page = 1 } = req.query;

    const resultPerPage = 20;
    const skip = (page - 1) * resultPerPage;

    const [message, totalMessageCount] = await Promise.all([
        Message.find({ chat: chatId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(resultPerPage)
            .populate("sender", "name avatar")
            .lean(),
        Message.countDocuments({ chat: chatId })

    ]);

    const totalPages = Math.ceil(totalMessageCount / resultPerPage);

    res.status(200).json({
        success: true,
        message: message.reverse(),
        totalPages
    })



})


export const deleteChat = tryCatch(async (req, res, next) => {

    const chatId = req.params.id;
    const chat = await Chat.findById(chatId);

    if (!chat) return next(ErrorHandler("Chat not found", 404));

    const members = chat.members;

    if (chat.groupChat && chat.creator.toString() !== req.user.toString())
        return next(ErrorHandler("You are not allowed to delete the group", 403))

    if (!chat.groupChat && !chat.members.includes(req.user.toString())) {
        return next(ErrorHandler("You are not allowed to delete the group", 403))
    }

    //Here we have to delete all messages as well as attachments or file from cloudinary

    const messagesWithAttachments = await Message.find({
        chat: chatId,
        attachments: { $exists: true, $ne: [] }
    });

    const public_ids = [];

    messagesWithAttachments.forEach(({ attachments }) => attachments.forEach(({ public_id }) => public_ids.push(public_id)));

    await Promise.all([
        deleteFileFromCloudinary(public_ids),
        Chat.deleteOne(),
        Message.deleteMany({ chat: chatId }),
    ]);

    emitEvent(req, REFETCH_CHAT, members);

    res.status(200).json({
        success: true,
        message: "Chat deleted successfully"
    })


});