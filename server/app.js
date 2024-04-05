import express from "express";
import connectDB from "./utils/dbConnection.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from 'http';
import { v4 as uuid } from "uuid";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import { corsOptions } from "./constants/config.js";

// import { createUser } from "./seeders/user.js";
// import { createGroupChat, createMessagesInAChat, createSingleChats, } from "./seeders/chat.js";

//Routes
import chatRoute from "./routes/chatRoute.js";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALLERT, START_TYPING, STOP_TYPING } from "./constants/events.js";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/messageModel.js";
import { socketAuthenticator } from "./middlewares/auth.js";

dotenv.config();


//Mongodb connection
const PORT = process.env.PORT || 3000;
export const envMode = process.env.NODE_ENV.trim() || "PRODUCTION"

const MONGO_URI = process.env.MONGO_URI;
connectDB(MONGO_URI);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const adminSecretKey = process.env.ADMIN_SECRET_KEY || "adminauthentication";
export const userSocketIDs = new Map();

// createSingleChats(10);
// createGroupChat(10);
// createMessagesInAChat("66019a90e0489af3e4f04bb2",50)


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });

app.set("io", io);

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));


app.get("/", (req, res) => {
    res.send("Hello")
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);

//socket middleware
io.use((socket, next) => {
    cookieParser()(
        socket.request,
        socket.request.res,
        async (err) => await socketAuthenticator(err, socket, next)
    );
});

//socket.io connection
io.on("connection", (socket) => {
    const user = socket.user;

    userSocketIDs.set(user._id.toString(), socket.id);

    console.log("a user connected", userSocketIDs);

    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
        const messageForRealTime = {
            content: message,
            _id: uuid(),
            sender: {
                _id: user._id,
                name: user.name
            },
            chat: chatId,
            createdAt: new Date().toISOString()
        };


        const messageForDB = {
            content: message,
            sender: user._id,
            chat: chatId
        };


        const membersSocket = getSockets(members);
        io.to(membersSocket).emit(NEW_MESSAGE, {
            chatId,
            message: messageForRealTime
        });

        io.to(membersSocket).emit(NEW_MESSAGE_ALLERT, {
            chatId,
        });

        try {

            await Message.create(messageForDB);

        } catch (error) {
            console.log(error);
        };

    });

    socket.on(START_TYPING, ({ members, chatId }) => {
        console.log("typing", chatId, members);

        const membersSockets = getSockets(members);
        socket.to(membersSockets).emit(START_TYPING,{chatId});
    });


    socket.on(STOP_TYPING, ({ members, chatId }) => {
        console.log("stop typing", chatId  );

        const membersSockets = getSockets(members);
        socket.to(membersSockets).emit(STOP_TYPING,{chatId});
    });


    socket.on("disconnect", () => {
        console.log("user disconnected");
        userSocketIDs.delete(user._id.toString());
    });

})

app.use(errorMiddleware);

//Server Running on PORT
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${envMode} Mode`);
}); 
