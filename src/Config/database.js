const mongoose = require('mongoose');

const connectDb = async () => {

    await mongoose.connect("mongodb+srv://kapil:desh@namastenode.hc69qwj.mongodb.net/devTinder");
}

module.exports = connectDb;



