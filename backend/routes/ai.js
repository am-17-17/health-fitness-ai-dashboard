import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Check if API key exists
if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Try to use an available model
const model = genAI.getGenerativeModel({
    model: "gemini-1.0-pro" // or "gemini-pro"
});

router.post("/recipe", async (req, res) => {
    try {
        const { goal } = req.body;

        if (!goal) {
            return res.status(400).json({
                message: "Goal is required"
            });
        }

        const prompt = `
You are a professional nutritionist.
Create a healthy meal plan for someone whose goal is: ${goal}.
Include breakfast, lunch, dinner and calories.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({
            result: text,
        });

    } catch (error) {
        console.error("Gemini Error Details:", {
            message: error.message,
            status: error.status,
            statusText: error.statusText
        });

        // Check for specific model errors
        if (error.message?.includes("Not Found")) {
            res.status(500).json({
                message: "AI Model configuration error. Please check the model name.",
                error: "Model not found"
            });
        } else {
            res.status(500).json({
                message: "AI Service Error",
                error: error.message
            });
        }
    }
});

export default router;