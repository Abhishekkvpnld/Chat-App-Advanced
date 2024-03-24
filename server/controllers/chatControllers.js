import { tryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chatModel.js";
import emitEvent from "../utils/emitEvent.js";
import { ALERT, REFETCH_CHAT } from "../constants/events.js";
import { getOthermember } from "../lib/helper.js";



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

    const chats = await Chat.find({ members: req.user }).populate(
        "members",
        "name avatar");

    const transformChat = chats.map(({ _id, name, members, groupChat }) => {
        return {
            _id,
            groupChat,
            avatar: groupChat ? members.slice(0, 3).map(({ avatar }) => avatar.url) : [getOthermember.avatar.url],
            name: groupChat ? name : getOthermember.name,
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
})