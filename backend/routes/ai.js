import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});

router.post("/recipe", async (req, res) => {
    try {
        const { goal } = req.body;

        const prompt = `
You are a professional nutritionist.
Create a healthy meal plan for someone whose goal is: ${goal}
Include breakfast, lunch, dinner and calories.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;

        res.json({
            result: response.text(),
        });

    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ message: "AI Error" });
    }
});

export default router;