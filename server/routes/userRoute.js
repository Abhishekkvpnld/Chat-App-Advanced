import express from "express";
import { logout, getMyProfile, logIn, newUser, searchUser, sendFriendRequest, getMyNotifications, getMyFriends } from "../controllers/userController.js";
import { singleAvatar } from "../middlewares/multerUpload.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { acceptRequestValidator, loginValidator, registerValidator, sendRequestValidator, validateHandler } from "../lib/validators.js";


const app = express.Router();

app.post("/register", singleAvatar, registerValidator(), validateHandler, newUser);
app.post("/login", loginValidator(), validateHandler, logIn);

//user must be logged in to access the routes
app.use(isAuthenticated);

app.get("/profile", getMyProfile);
app.get("/logout", logout);
app.get("/search", searchUser);
app.put("/sendrequest", sendRequestValidator(), validateHandler, sendFriendRequest);
app.put("/acceptrequest",acceptRequestValidator(),validateHandler);
app.get("/notifications",getMyNotifications);
app.get("/friends",getMyFriends);

export default app;   