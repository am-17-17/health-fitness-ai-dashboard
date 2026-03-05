import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Navbar from "./Navbar";
import Footer from "../components/Footer";

function Recipe() {
    const [goal, setGoal] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const generateRecipe = async () => {
        if (!goal.trim()) {
            alert("Please enter a goal first");
            return;
        }

        try {
            setLoading(true);
            setResult("");

            const response = await axios.post(
                `${API_URL}/api/ai/recipe`,
                { goal }
            );

            setResult(response.data.result);
        } catch (error) {
            console.error(error);
            setResult("AI failed. Check backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            width: "100%",
            background: "linear-gradient(to bottom, #0f172a, #1e293b)",
            color: "white",
            padding: "60px",
            boxSizing: "border-box",
        }}>

            <h1 style={{ fontSize: "22px" }}>
                HEALTH & FITNESS AI DASHBOARD
            </h1>

            <Navbar />

            <div style={{
                maxWidth: "600px",
                margin: "80px auto",
                background: "rgba(255,255,255,0.05)",
                padding: "40px",
                borderRadius: "15px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
            }}>

                <h1>AI Recipe Generator</h1>

                <div style={{
                    textAlign: "center",
                    marginTop: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "20px"
                }}>

                    <input
                        type="text"
                        placeholder="Enter your goal (e.g. weight loss)"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        style={{
                            padding: "15px 20px",
                            borderRadius: "8px",
                            border: "none",
                            width: "250px"
                        }}
                    />

                    <button
                        className="primary-btn"
                        onClick={generateRecipe}
                    >
                        Generate Recipe
                    </button>

                    {loading && <p>Generating...</p>}
                </div>

                {result && (
                    <div style={{ marginTop: "30px", whiteSpace: "pre-line" }}>
                        {result}
                    </div>
                )}

            </div>

            <Footer />

        </div>
    );
}

export default Recipe;