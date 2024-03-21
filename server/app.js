import express from "express";
import userRoute from "./routes/userRoute.js";

const app = express();

app.use("/user",userRoute)

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
