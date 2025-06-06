import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Database connected successfully")
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

export default connectDB