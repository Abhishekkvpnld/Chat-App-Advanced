import express from "express";
import { adminLogin, adminLogout, allChats, allMessages, allUsers, getDashboardStats } from "../controllers/adminController.js";
import { adminLoginValidator, validateHandler } from "../lib/validators.js";
import { validate } from "uuid";

const app = express.Router();



app.post("/verify",adminLoginValidator(),validateHandler,adminLogin);
app.get("/logout",adminLogout);


//Only Admin Can Access These Routes
// app.get("/");
app.get("/users",allUsers);
app.get("/chats",allChats);
app.get("/messages",allMessages);
app.get("/stats",getDashboardStats);

export default app;