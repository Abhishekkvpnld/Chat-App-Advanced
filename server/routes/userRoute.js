import express from "express";
import { logIn,newUser } from "../controllers/userController.js";
import {singleAvatar} from "../middlewares/multerUpload.js"

const app = express.Router();

app.post("/new",singleAvatar,newUser);
app.post("/login",logIn);


export default app;  