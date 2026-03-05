import express from "express";
import OpenAI from "openai";

const router = express.Router();

// Check if API key exists
if (!process.env.DEEPSEEK_API_KEY) {
    console.error("❌ DEEPSEEK_API_KEY is not set in environment variables");
}

// Initialize DeepSeek client (OpenAI-compatible)
const deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com/v1", // DeepSeek's API endpoint [citation:7][citation:10]
});

// Test endpoint to check if everything works
router.get("/test", async (req, res) => {
    try {
        const completion = await deepseek.chat.completions.create({
            model: "deepseek-chat", // Use V3 model for general conversation [citation:1][citation:3]
            messages: [
                { role: "user", content: "Say hello in one word" }
            ],
            max_tokens: 10
        });

        res.json({
            success: true,
            message: "DeepSeek is working!",
            response: completion.choices[0].message.content
        });
    } catch (error) {
        console.error("Test failed:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Main recipe endpoint
router.post("/recipe", async (req, res) => {
    try {
        const { goal } = req.body;

        if (!goal) {
            return res.status(400).json({
                message: "Goal is required"
            });
        }

        console.log(`📝 Generating recipe for goal: ${goal}`);

        const completion = await deepseek.chat.completions.create({
            model: "deepseek-chat", // Using V3 model [citation:1]
            messages: [
                {
                    role: "system",
                    content: "You are a professional nutritionist. Create healthy meal plans with breakfast, lunch, dinner, and approximate calories. Be concise and practical."
                },
                {
                    role: "user",
                    content: `Create a healthy meal plan for someone whose goal is: ${goal}.`
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        const recipe = completion.choices[0].message.content;

        console.log("✅ Recipe generated successfully");

        res.json({
            result: recipe,
        });

    } catch (error) {
        console.error("❌ DeepSeek Error:", {
            message: error.message,
            status: error.status
        });

        res.status(500).json({
            message: "AI Service Error",
            error: error.message
        });
    }
});

export default router;