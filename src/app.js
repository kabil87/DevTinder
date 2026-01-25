const express = require('express');
const { adminAuth } = require('./Middleware/auth');

const app = express();

app.use("/admin",adminAuth)

 app.get("/user",(req,res)=>{
    res.send("Here is your user")
 })

app.get("/admin/getAllData",(req,res)=>{
    res.send("All Data...")
});

app.get("/admin/deleteData",(req,res)=>{
    res.send("Deleted All the Data...")
});


app.listen(3000,()=>{
    console.log("Server is Listening on Port 3000...");  
});