import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMembers, renameGroup, sendAttachments } from "../controllers/chatControllers.js";
import { AttachmentsMulter } from "../middlewares/multerUpload.js";
import { addMemberValidator, chatIdValidator, newGroupChatValidator, removeMemberValidator, renameGroupValidator, sendAttachmentsValidator, validateHandler } from "../lib/validators.js"

const app = express.Router();



//user must be logged in to access the routes
app.use(isAuthenticated);

app.post("/new", newGroupChatValidator(), validateHandler, newGroupChat);
app.get("/my", getMyChats);
app.get("/my/groups", getMyGroups);
app.put("/addmembers", addMemberValidator(), validateHandler, addMembers);
app.put("/removemember", removeMemberValidator(), validateHandler, removeMembers);
app.delete("/leave/:id", chatIdValidator(), validateHandler, leaveGroup);

//Send Attachments
app.post("/messages", AttachmentsMulter, sendAttachmentsValidator(), validateHandler, sendAttachments);
//Get Messages
app.get("/messages/:id", chatIdValidator(), validateHandler, getMessages);
//Get Chat details, Rename, Delete
app.route("/:id")
    .get(chatIdValidator(), validateHandler, getChatDetails)
    .put(renameGroupValidator(), validateHandler, renameGroup)
    .delete(chatIdValidator(), validateHandler, deleteChat);


export default app;   