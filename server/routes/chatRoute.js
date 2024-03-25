import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMembers, renameGroup, sendAttachments } from "../controllers/chatControllers.js";
import { AttachmentsMulter } from "../middlewares/multerUpload.js";

const app = express.Router();



//user must be logged in to access the routes
app.use(isAuthenticated);

app.post("/new", newGroupChat);
app.get("/my", getMyChats);
app.get("/my/groups", getMyGroups);
app.put("/addmembers", addMembers);
app.put("/removemember", removeMembers);
app.delete("/leave/:id", leaveGroup);

//Send Attachments
app.post("/messages", AttachmentsMulter, sendAttachments);
//Get Messages
app.get("/messages/:id",getMessages);
//Get Chat details, Rename, Delete
app.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat);


export default app;   