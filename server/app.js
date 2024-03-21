import express from "express";
import userRoute from "./routes/userRoute.js";
import connectDB from "./utils/dbConnection.js";
import dotenv from "dotenv";


dotenv.config();


//Mongodb connection
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;  
connectDB(MONGO_URI); 

const app = express();

//middlewares
app.use(express.json());
// app.use(express.urlencoded());

app.get("/",(req,res)=>{
    res.send("Hello")
})

app.use("/user",userRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
