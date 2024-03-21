import mongoose from "mongoose";

const connectDb = (uri) => {
    mongoose.connect(uri, { dbName: "database" })
        .then(() => {
            console.log(`Connected to DB: ${mongoose.connection.host}`);
        })
        .catch((err) => {
            console.error(`Error connecting to DB: ${err.message}`);
        });
};

export default connectDb;
