const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const url = 'mongodb+srv://dimachine:VImvqU2005@cluster0.pir3qph.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
        await mongoose.connect(url, {dbName: 'neddit'});
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database failed to connect:", error);
        process.exit(1);
    }
}

module.exports = connectDB;