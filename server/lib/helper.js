

export const getOtherMember = (members, userId) => {

    if (!Array.isArray(members)) {
        console.error("Error: members is not an array");
    }

    const otherMember = members.find((member) => member._id.toString() !== userId.toString());
    return otherMember;
};
