import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
// import authMiddleware from "./middleware/authMiddleware.js";
import authMiddleware from "./middleware/authMiddleware.js";
import passport from "passport";
import contactRoutes from "./routes/contactRoutes.js";
import "./config/passport.js";




// Load environment variables from .env file
dotenv.config();

// Mongo DB connection

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed", error);
    });

// Create an express application 
const app = express();

app.use(express.json());
// Middleware

app.use(cors());

// Session middleware (required for Passport)



// Initialize Passport
app.use(passport.initialize());



// Auth Routes

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
// Routes

app.get("/", (req, res) => {
    res.send("Backend is running ");

});



// protected route

app.get("/api/protected", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "You have accessed a protected route",
        userId: req.user.id
    });
});

// Server Listen 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

});