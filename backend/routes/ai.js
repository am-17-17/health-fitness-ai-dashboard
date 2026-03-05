import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Check if API key exists
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Array of possible model names to try
const POSSIBLE_MODELS = [
    "gemini-pro",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "gemini-1.0-pro-001",
    "gemini-pro-vision",
    "models/gemini-pro",  // Try with models/ prefix
    "models/gemini-1.5-pro",
];

// Try to find a working model
let workingModel = null;
let model = null;

// Function to test a model
async function testModel(modelName) {
    try {
        console.log(`🔄 Testing model: ${modelName}`);
        const testModel = genAI.getGenerativeModel({ model: modelName });
        const result = await testModel.generateContent("Say 'test' in one word");
        const response = await result.response;
        const text = response.text();
        console.log(`✅ Model ${modelName} works! Response: ${text}`);
        return true;
    } catch (error) {
        console.log(`❌ Model ${modelName} failed:`, error.message);
        return false;
    }
}

// Initialize - try to find a working model on startup
(async function initializeModel() {
    console.log("🔍 Looking for a working Gemini model...");

    for (const modelName of POSSIBLE_MODELS) {
        const works = await testModel(modelName);
        if (works) {
            workingModel = modelName;
            model = genAI.getGenerativeModel({ model: modelName });
            console.log(`🎉 Using model: ${workingModel}`);
            break;
        }
    }

    if (!workingModel) {
        console.error("❌ No working Gemini model found!");
        // Fallback to gemini-pro as default
        try {
            model = genAI.getGenerativeModel({ model: "gemini-pro" });
            console.log("⚠️ Using fallback model: gemini-pro");
        } catch (error) {
            console.error("❌ Fallback also failed:", error.message);
        }
    }
})();

// ✅ DEBUG ROUTE - moved outside and before other routes
router.get("/debug-gemini", async (req, res) => {
    try {
        const results = {};
        const errors = {};

        // Test each model quickly
        for (const modelName of POSSIBLE_MODELS.slice(0, 5)) { // Test first 5 models
            try {
                console.log(`🔍 Debug testing: ${modelName}`);
                const testModel = genAI.getGenerativeModel({ model: modelName });
                const result = await testModel.generateContent("Say 'hi' in one word");
                const text = (await result.response).text();
                results[modelName] = { success: true, response: text };
            } catch (e) {
                errors[modelName] = {
                    message: e.message,
                    status: e.status,
                    statusText: e.statusText
                };
                results[modelName] = { success: false };
            }
        }

        // Check if model is initialized
        const modelStatus = {
            workingModel: workingModel,
            modelInitialized: !!model,
            fallbackActive: !workingModel && !!model
        };

        res.json({
            status: "debug info",
            apiKeyExists: !!process.env.GEMINI_API_KEY,
            apiKeyPrefix: process.env.GEMINI_API_KEY ?
                process.env.GEMINI_API_KEY.substring(0, 8) + "..." : "none",
            modelStatus,
            testResults: results,
            errors: errors,
            possibleModels: POSSIBLE_MODELS,
            note: "Check server console for detailed logs"
        });
    } catch (error) {
        console.error("Debug endpoint error:", error);
        res.status(500).json({
            error: "Debug endpoint failed",
            message: error.message
        });
    }
});

// Route to check available models
router.get("/check-models", async (req, res) => {
    res.json({
        currentModel: workingModel || "Not set - trying gemini-pro",
        possibleModels: POSSIBLE_MODELS,
        note: "Testing different models on startup. Check server logs."
    });
});

// Route to manually test a specific model
router.post("/test-model", async (req, res) => {
    try {
        const { modelName } = req.body;

        if (!modelName) {
            return res.status(400).json({ error: "modelName is required" });
        }

        console.log(`🧪 Testing model: ${modelName}`);
        const testModel = genAI.getGenerativeModel({ model: modelName });
        const result = await testModel.generateContent("Say 'hello' in one word");
        const response = await result.response;
        const text = response.text();

        res.json({
            success: true,
            model: modelName,
            response: text
        });
    } catch (error) {
        console.error(`❌ Test model failed: ${req.body.modelName}`, error.message);
        res.status(500).json({
            success: false,
            model: req.body.modelName,
            error: error.message,
            status: error.status
        });
    }
});

// Main recipe route
router.post("/recipe", async (req, res) => {
    try {
        const { goal } = req.body;

        if (!goal) {
            return res.status(400).json({
                message: "Goal is required"
            });
        }

        console.log(`📝 Generating recipe for goal: ${goal}`);
        console.log(`🤖 Using model: ${workingModel || "gemini-pro"}`);

        const prompt = `
You are a professional nutritionist.
Create a healthy meal plan for someone whose goal is: ${goal}.
Include breakfast, lunch, dinner and calories.
Format the response in a clear, readable way.
`;

        // Check if model is initialized
        if (!model) {
            console.error("❌ Model not initialized");
            return res.status(503).json({
                message: "AI Service is initializing. Please try again.",
                error: "Model not ready"
            });
        }

        // Use the model (either working one or fallback)
        const currentModel = model;
        const result = await currentModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("✅ Recipe generated successfully");

        res.json({
            result: text,
            modelUsed: workingModel || "gemini-pro"
        });

    } catch (error) {
        console.error("❌ Gemini Error Details:", {
            message: error.message,
            status: error.status,
            statusText: error.statusText
        });

        res.status(500).json({
            message: "AI Service Error",
            error: error.message,
            modelAttempted: workingModel || "gemini-pro",
            suggestion: "Try using /api/ai/test-model endpoint to test different models"
        });
    }
});

export default router;