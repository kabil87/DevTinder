const express = require('express');
const app = express();
const connectDb = require('./Config/database');
const cookieParser = require("cookie-parser");
const authRouter = require("./Routers/auth");
const profileRouter = require("./Routers/profile")

app.use(express.json());
app.use(cookieParser())


app.use("/",authRouter);
app.use("/",profileRouter);


connectDb()
.then(() => {
    console.log("DataBase connection Established...");
    app.listen(7777,()=>{
    console.log("Server is Listening on Port 7777...");  
})})
.catch((err) => console.log("Database can not be Established..."))


