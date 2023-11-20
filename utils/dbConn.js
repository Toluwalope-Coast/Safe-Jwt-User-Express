// dbConn.js
import mongoose from "mongoose";

export const databaseConnection = () => {
    mongoose
        .connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Connected to database");

            // MongoDB connection events
            mongoose.connection.on('connected', () => {
                console.log('MongoDB connected');
            });

            mongoose.connection.on('error', (err) => {
                console.error(`MongoDB connection error: ${err}`);
            });

            mongoose.connection.on('disconnected', () => {
                console.log('MongoDB disconnected');
            });
        })
        .catch((err) => {
            console.error(`Error connecting to database: ${err}`);
            process.exit(1); // Gracefully exit the application on database connection error
        });
};
