import { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import Footer from "../components/Footer";


function Workout() {

    // Store Selected fitness goal 
    const [goal, setGoal] = useState("");
    // Stores generated workout list
    const [generatedWorkout, setGeneratedWorkout] = useState("");


    // Dummy workout plans based on goal
  


    // Function to generate workout
    const handleGenerateWorkout = async () => {
        try {
            const response = await axios.post(
                `${API_URL}/api/ai/workout`,
                { goal }
            );

            setGeneratedWorkout(response.data.result);

        } catch (error) {
            console.error(error);
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

                <h1>AI Workout Generator</h1>


                {/* LIST OPTION */}
                
                <div style={{
                    textAlign: "center",
                    marginTop: "20px",
                    // marginTop: "30px",
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
                            width: "250px",
                            marginTop: "20px"
                        }}
                    />
                </div>
                

                {/* BUTTON */}
                <div 
                    style={{
                    textAlign: "center",
                    marginTop: "10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px"
             }}>
                
                
                    <button className="primary-btn"
                        onClick={handleGenerateWorkout}
               >
                Generate Workout
                    </button>
                </div>

        


                {generatedWorkout && (
                <div>
                    <h3>Recommended Workout:</h3>
                        <div style={{ marginTop: "20px", whiteSpace: "pre-line" }}>
                            {generatedWorkout}
                        </div>
                    
                </div>
            )}





             </div>
            <Footer />
        </div>
    );
}

export default Workout;