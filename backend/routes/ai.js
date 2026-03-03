import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

router.post("/recipe", async (req, res) => {
    try {
        const { goal } = req.body;

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: `You are a professional nutritionist.
Create a healthy meal plan for someone whose goal is: ${goal}.
Include breakfast, lunch, dinner and calories.`,
        });

        res.json({
            result: response.text,
        });

    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ message: "AI Error" });
    }
});

export default router;