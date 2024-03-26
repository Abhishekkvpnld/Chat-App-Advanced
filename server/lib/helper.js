

export const getOtherMember = (members, userId) => {

    if (!Array.isArray(members)) {
        console.error("Error: members is not an array");
    }

    // Use Array.prototype.find to search for the other member
    const otherMember = members.find((member) => member._id.toString() !== userId.toString());
    return otherMember;
};
