import express from "express";
import { getMyProfile, logIn,newUser } from "../controllers/userController.js";
import {singleAvatar} from "../middlewares/multerUpload.js";
import { errorMiddleware } from "../middlewares/error.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = express.Router();

app.post("/new",singleAvatar,newUser);
app.post("/login",logIn,errorMiddleware);

//user must be logged in to access the routes
app.get("/auth",isAuthenticated,getMyProfile)
 
export default app;   