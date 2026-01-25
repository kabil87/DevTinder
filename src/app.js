const express = require('express');

const app = express();

app.get("/user",

(req,res,next)=>{
    console.log("Response 1");
    next();
},
(req,res,next) => {

    console.log("Response 2");
    next()

},
(req,res,next)=>{
    console.log("Response 3");  
    res.send("Response 3");
}
)



app.listen(3000,()=>{
     console.log("Server is Listening on Port 3000...");  
})


