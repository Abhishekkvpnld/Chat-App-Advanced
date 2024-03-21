import express from "express";
import { logIn } from "../controllers/userController.js";

const app = express.Router();

app.get("/login",logIn);

export default app;