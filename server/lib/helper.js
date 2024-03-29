import { userSocketIDs } from "../app.js";


export const getOtherMember = (members, userId) => {

    if (!Array.isArray(members)) {
        console.error("Error: members is not an array");
    }

    const otherMember = members.find((member) => member._id.toString() !== userId.toString());
    return otherMember;
};


export const getSockets = (users = []) => {
    const sockets = users.map((user) => userSocketIDs.get(user._id.toString()));
    return sockets;
};


export const getBase64 = (file) =>
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;