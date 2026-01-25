const adminAuth = (req,res,next)=>{
    let = token = "ok";
    let isAuthorized = token === "ok";

    if (! isAuthorized){
        res.status(401).send("UnAuthorized")
    }
    else {
        next();
    }
}

module.exports = {
    adminAuth
}