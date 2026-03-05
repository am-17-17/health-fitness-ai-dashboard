import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

// Debug endpoint to check environment
router.get("/debug-env", (req, res) => {
    res.json({
        groqKeyExists: !!process.env.GROQ_API_KEY,
        groqKeyPrefix: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 8) + "..." : "not set",
        nodeEnv: process.env.NODE_ENV,
        allEnvKeys: Object.keys(process.env).filter(key => !key.includes('PASS') && !key.includes('SECRET'))
    });
});

// Initialize Groq
let groq;
try {
    if (!process.env.GROQ_API_KEY) {
        console.error("❌ GROQ_API_KEY is not set");
    } else {
        groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });
        console.log("✅ Groq initialized with key:", process.env.GROQ_API_KEY.substring(0, 8) + "...");
    }
} catch (error) {
    console.error("❌ Failed to initialize Groq:", error);
}

// Simple test endpoint
router.get("/test", (req, res) => {
    res.json({
        message: "AI route is working",
        groqReady: !!groq
    });
});

// Test Groq connection
router.get("/test-groq", async (req, res) => {
    try {
        if (!groq) {
            return res.status(500).json({ error: "Groq not initialized" });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "user", content: "Say 'Groq is working!'" }
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
        console.error("❌ Groq test failed:", error);
        res.status(500).json({
            success: false,
            error: error.message,
            status: error.status
        });
    }
});

router.post("/recipe", async (req, res) => {
    console.log("📝 Recipe endpoint called with body:", req.body);

    try {
        const { goal } = req.body;

        if (!goal) {
            console.log("❌ No goal provided");
            return res.status(400).json({ error: "Goal is required" });
        }

        if (!groq) {
            console.log("❌ Groq not initialized");
            return res.status(500).json({ error: "Groq client not initialized" });
        }

        console.log(`📝 Generating recipe for goal: ${goal}`);

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
            model: "mixtral-8x7b-32768",
            temperature: 0.7,
            max_tokens: 1000
        });

        const recipe = completion.choices[0]?.message?.content || "";
        console.log("✅ Recipe generated successfully, length:", recipe.length);

        res.json({
            success: true,
            result: recipe
        });

    } catch (error) {
        console.error("❌ Groq Error:", {
            message: error.message,
            status: error.status,
            stack: error.stack
        });

        res.status(500).json({
            success: false,
            error: error.message,
            details: "Check server logs for more info"
        });
    }
});

export default router;