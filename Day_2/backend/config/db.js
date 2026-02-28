const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        await mongoose.connect("mongodb+srv://mohammadsinan959_db_user:Sinan%40959@cluster0.ke4sczn.mongodb.net/studentDB");
        console.log("Database Connected Successfully");
    } catch (err) {
        console.log("❌ DATABASE CONNECTION FAILED");
        console.log(err);
    }
};

module.exports = connectDB;