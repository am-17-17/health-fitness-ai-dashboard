import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Check if API key exists
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Try different model options - uncomment the one you want to test
const model = genAI.getGenerativeModel({
    model: "gemini-1.0-pro" // Try this first
});

// Alternative models to try if gemini-1.0-pro doesn't work:
// model: "gemini-pro"
// model: "gemini-1.5-pro"
// model: "gemini-1.5-flash"

// Route to check available models (move this OUTSIDE the error handler)
router.get("/check-models", async (req, res) => {
    try {
        // Note: listModels() might not be available in all versions
        // If this fails, we'll try an alternative approach
        res.json({
            message: "Model check endpoint",
            currentModel: model.model,
            note: "Use the test-prompt endpoint to test specific models"
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to check models",
            message: error.message
        });
    }
});

// Test endpoint to try different models
router.post("/test-prompt", async (req, res) => {
    try {
        const { modelName, prompt } = req.body;

        // Create a new model instance with the requested model name
        const testModel = genAI.getGenerativeModel({
            model: modelName || "gemini-1.0-pro"
        });

        const testPrompt = prompt || "Say hello in one word";
        const result = await testModel.generateContent(testPrompt);
        const response = await result.response;
        const text = response.text();

        res.json({
            success: true,
            modelUsed: modelName || "gemini-1.0-pro",
            response: text
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            status: error.status
        });
    }
});

router.post("/recipe", async (req, res) => {
    try {
        const { goal } = req.body;

        if (!goal) {
            return res.status(400).json({
                message: "Goal is required"
            });
        }

        console.log(`📝 Generating recipe for goal: ${goal}`);

        const prompt = `
You are a professional nutritionist.
Create a healthy meal plan for someone whose goal is: ${goal}.
Include breakfast, lunch, dinner and calories.
Format the response in a clear, readable way.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("✅ Recipe generated successfully");

        res.json({
            result: text,
        });

    } catch (error) {
        console.error("❌ Gemini Error Details:", {
            message: error.message,
            status: error.status,
            statusText: error.statusText
        });

        // Check for specific model errors
        if (error.message?.includes("Not Found")) {
            res.status(500).json({
                message: "AI Model configuration error. Please check the model name.",
                error: "Model not found",
                suggestion: "Try using /api/ai/test-prompt endpoint to test different models"
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