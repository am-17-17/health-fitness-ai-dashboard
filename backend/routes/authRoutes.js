import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";
import passport from "passport";

const router = express.Router();

// Signup Route

router.post("/signup", async (req, res) => {

    // error handling

    try {
        const { name, email, password } = req.body;



        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });

        }

        // checks if user already exists 

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exisits" });

        }


        // Hash password before saving 
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            provider:"local",
        });

        // save to database

        await newUser.save();


        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });

    }


});



// Login Route

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (user && user.provider === "google") {
            return res.status(400).json({
                message: "Please login using Google"
            });
        }

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({ message: "Login Successfully", token });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }

});

// Google Auth Route
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session:false,
    })
);


// Google callback Route

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/",session:false, }),
    async (req, res) => {
        try {
            // Create JWT for the logged in Google user

            const token = jwt.sign(
                { id: req.user.id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            // Redirect to frontend with token
            res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);

        }
        catch (error) {
            res.redirect(process.env.CLIENT_URL)
        }
    }
);

    // Get profile Route 

    router.get("/profile", authMiddleware, async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select("-password");

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user);
        }
        catch (error) {

            console.error(error);
            res.status(500).json({ message: "Server Error" });
            
        }
   
});

export default router;
