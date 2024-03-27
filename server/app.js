import express from "express";
import connectDB from "./utils/dbConnection.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";

// import { createUser } from "./seeders/user.js";
// import { createGroupChat, createMessagesInAChat, createSingleChats, } from "./seeders/chat.js";

//Routes
import chatRoute from "./routes/chatRoute.js";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";

dotenv.config();


//Mongodb connection
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
connectDB(MONGO_URI);

// createSingleChats(10);
// createGroupChat(10);
// createMessagesInAChat("66019a90e0489af3e4f04bb2",50)


const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello")
})

app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/admin",adminRoute);

app.use(errorMiddleware);

//Server Running on PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
