

export const getOthermember = (members, chatId) =>
    members.find((member) => member._id.toString() !== userId.toString());
