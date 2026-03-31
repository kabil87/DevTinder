const express = require("express");
const app = express();
const connectDb = require("./Config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

require('dotenv').config()

const authRouter = require("./Routers/auth");
const profileRouter = require("./Routers/profile");
const requestRouter = require("./Routers/request");
const userRouter = require("./Routers/user");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./Routers/chat");

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))
app.use(express.json());
app.use(cookieParser());


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDb()
.then(() => {
  console.log("DataBase connection Established...");
  server.listen(process.env.PORT, () => {
    console.log("Server is Listening on Port 7777...");
  });
})
.catch(() => console.log("Database can not be Established..."));