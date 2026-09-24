const mongoose = require('mongoose');

const uri = "mongodb://techquantumindia_db_user:Walfz5O1aYpDq5wR@ac-yt1bu6p-shard-00-00.bjck0g4.mongodb.net:27017,ac-yt1bu6p-shard-00-01.bjck0g4.mongodb.net:27017,ac-yt1bu6p-shard-00-02.bjck0g4.mongodb.net:27017/?ssl=true&replicaSet=atlas-yt1bu6-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

async function run() {
    try {
        console.log("Connecting with family: 6...");
        await mongoose.connect(uri, { family: 6, serverSelectionTimeoutMS: 5000 });
        console.log("Connected successfully to MongoDB!");
        process.exit(0);
    } catch(err) {
        console.error("Connection failed:", err.message);
        process.exit(1);
    }
}
run();
