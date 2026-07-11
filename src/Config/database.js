const mongoose = require('mongoose');

const connectDb = async () => {

    console.log("Debugking...");
    
    console.log(process.env.DB_CONNECTION);
    
    await mongoose.connect(process.env.DB_CONNECTION);
};
module.exports = connectDb;