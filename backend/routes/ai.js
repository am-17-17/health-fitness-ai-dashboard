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

// List of currently available models on Groq
const AVAILABLE_MODELS = {
    // Fast models
    fast: "llama-3.3-70b-versatile",  // Fast and capable
    // Alternative models if needed:
    // "mixtral-8x7b-32768" is DEPRECATED - do not use
    // "llama2-70b-4096" is also available
    // "gemma2-9b-it" is another option
};

router.post("/recipe", async (req, res) => {
    console.log("📝 Recipe endpoint called with body:", req.body);

    try {
        const { goal } = req.body;

        if (!goal) {
            console.log("❌ No goal provided");
            return res.status(400).json({ error: "Goal is required" });
        }

        console.log(`📝 Generating recipe for goal: ${goal}`);

        // Using the current working model
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a professional nutritionist. Create healthy meal plans with breakfast, lunch, dinner, and approximate calories. Be practical and specific."
                },
                {
                    role: "user",
                    content: `Create a detailed meal plan for ${goal}`
                }
            ],
            model: "llama-3.3-70b-versatile", // Current working model
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
            status: error.status
        });

        res.status(500).json({
            success: false,
            error: error.message,
            hint: "If model error, try: llama-3.3-70b-versatile or mixtral-8x7b-32768 is deprecated"
        });
    }
});




//  workout page

router.post("/workout", async (req, res) => {
    try {
        const { goal } = req.body;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a professional fitness trainer."
                },
                {
                    role: "user",
                    content: `Create a 7 day workout plan for ${goal}. Include exercises, sets, reps and rest time.`
                }
            ],
            model: "llama-3.3-70b-versatile"
        });

        const workout = completion.choices[0]?.message?.content;

        res.json({
            success: true,
            result: workout
        });

    } catch (error) {
        console.error("Workout AI Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Test endpoint to check available models
router.get("/test-models", async (req, res) => {
    try {
        // Try with a simple prompt
        const testModel = await groq.chat.completions.create({
            messages: [
                { role: "user", content: "Say 'working'" }
            ],
            model: "llama-3.3-70b-versatile",
            max_tokens: 10
        });

        res.json({
            success: true,
            message: "Current model is working!",
            modelUsed: "llama-3.3-70b-versatile",
            response: testModel.choices[0]?.message?.content
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Alternative: Try different models if one doesn't work
router.get("/try-alternatives", async (req, res) => {
    const modelsToTry = [
        "llama-3.3-70b-versatile",
        "llama3-70b-8192",
        "mixtral-8x7b-32768", // This one is deprecated but showing as example
        "gemma2-9b-it"
    ];

    const results = {};

    for (const model of modelsToTry) {
        try {
            const test = await groq.chat.completions.create({
                messages: [{ role: "user", content: "Say 'hi'" }],
                model: model,
                max_tokens: 5
            });
            results[model] = { working: true, response: test.choices[0]?.message?.content };
        } catch (e) {
            results[model] = { working: false, error: e.message };
        }
    }

    res.json(results);
});

export default router;