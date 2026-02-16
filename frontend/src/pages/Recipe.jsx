import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "../components/Footer";

function Recipe() {
    // State for user Goal
    const [goal, setGoal] = useState("");
    // generate recipe 
    const [generatedRecipes, setGenratedRecipe] = useState([]);

 
    // Dummy recipe data based on goal
    const recipeData = {
        weightLoss: [
            "Grilled Chicken Salad 🥗",
            "Oats with Berries 🍓",
            "Vegetable Soup 🍲"
        ],
        muscleGain: [
            "High Protein Chicken Bowl 🍗",
            "Peanut Butter Banana Shake 🥤",
            "Egg & Avocado Toast 🍳"
        ],
        maintain: [
            "Balanced Veg Thali 🍛",
            "Paneer Wrap 🌯",
            "Fruit & Yogurt Bowl 🍎"
        ]
    };

    const handeleGenrate = () => {
        if (goal && recipeData[goal]) {
            setGenratedRecipe(recipeData[goal]);
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

                {/* HEADING */}
                <h1>AI Recipe Generator</h1>

                
                {/* LIST OPTION */}

                <div style={{
                    textAlign: "center",
                    marginTop: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "20px"
                    
                    
                }}>
                
                    <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                    style={{
                    padding: "17px 24px",
                    border: "none",
                    borderRadius: "8px",
                    marginTop: "20px",
                        
                }}>

                        
                <option value="">Select Your Goal</option>
                <option value="weightLoss">Weight Loss</option>
                <option value="muscleGain">Muscle Gain</option>
                <option value="maintain">Maintain Weight</option>

                        
                     </select>
                 
                </div>
 
          
            {/* BUTTON */}

                <div style={{
                    textAlign: "center",
                  marginTop: "10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "20px"
             }}>
                
                    <button 
                        onClick={handeleGenrate}
                        className="primary-btn"
                
            >
                Generate Recipes
            </button>
</div>

      

            
            {/*  RECIPE DISPLAY SECTION  */}

            {generatedRecipes.length > 0 && (
                <div style={{ marginTop: "50px" }}>
                    <h3>Recommended Recipes:</h3>
                    <ul>
                        {generatedRecipes.map((item, index) => (
                            <li key={index} style={{ marginBottom: "12px" }}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            </div>
            <Footer />
        </div>
    );
}

export default Recipe;