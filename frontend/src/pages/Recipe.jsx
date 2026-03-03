import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

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
        <div className="page">
            <div className="page-content">

                <h2>AI Recipe Generator</h2>

                <input
                    type="text"
                    placeholder="Enter your goal (e.g. weight loss)"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                />

                <button className="primary-btn" onClick={generateRecipe}>
                    Generate
                </button>

                {loading && <p>Generating...</p>}

                {result && (
                    <div style={{ marginTop: "20px", whiteSpace: "pre-line" }}>
                        {result}
                    </div>
                )}

            </div>
        </div>
    );
}

export default Recipe;