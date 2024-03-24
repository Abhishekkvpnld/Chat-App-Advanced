import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getMyChats, newGroupChat } from "../controllers/chatControllers.js";

const app = express.Router();



//user must be logged in to access the routes
app.use(isAuthenticated);

app.post("/new",newGroupChat);
app.get("/my",getMyChats);

export default app;   