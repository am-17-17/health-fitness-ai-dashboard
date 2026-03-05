import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

// Check if API key exists
if (!process.env.GROQ_API_KEY) {
    console.error("❌ GROQ_API_KEY is not set in environment variables");
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Test endpoint to check if Groq is working
router.get("/test-groq", async (req, res) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "user", content: "Say 'Groq is working!' in one sentence" }
            ],
            model: "mixtral-8x7b-32768",
            max_tokens: 20
        });

        res.json({
            success: true,
            message: "Groq is connected!",
            response: completion.choices[0]?.message?.content
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.post("/recipe", async (req, res) => {
    try {
        const { goal } = req.body;

        console.log("📝 Generating recipe for goal:", goal);

        if (!goal) {
            return res.status(400).json({ error: "Goal is required" });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a professional nutritionist. Create healthy meal plans with breakfast, lunch, dinner, and approximate calories."
                },
                {
                    role: "user",
                    content: `Create a detailed meal plan for ${goal}`
                }
            ],
            model: "mixtral-8x7b-32768", // Free model with 32K context
            temperature: 0.7,
            max_tokens: 1000
        });

        const recipe = completion.choices[0]?.message?.content || "";
        console.log("✅ Recipe generated successfully");

        res.json({
            success: true,
            result: recipe
        });

    } catch (error) {
        console.error("❌ Groq Error:", error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;