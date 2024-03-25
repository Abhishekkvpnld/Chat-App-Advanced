import express from "express";
import { logout, getMyProfile, logIn, newUser, searchUser } from "../controllers/userController.js";
import { singleAvatar } from "../middlewares/multerUpload.js";
import { errorMiddleware } from "../middlewares/error.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { loginValidator, registerValidator, validateHandler } from "../lib/validators.js";

const app = express.Router();

app.post("/register", singleAvatar, registerValidator(),validateHandler, newUser);
app.post("/login",loginValidator(),validateHandler,logIn);

//user must be logged in to access the routes
app.use(isAuthenticated);

app.get("/profile", getMyProfile);
app.get("/logout", logout);
app.get("/search", searchUser);

export default app;   