import mongoose from "mongoose";

const connectDb = (uri) => {
    mongoose.connect(uri, { dbName: "advanced-chat-app" })
        .then(() => {
            console.log(`Connected to DB: ${mongoose.connection.host}`);
        })
        .catch((err) => {
            console.error(`Error connecting to DB: ${err.message}`);
        });
};

export default connectDb;
