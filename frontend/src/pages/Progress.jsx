import { useEffect, useState } from "react";
import Navbar from "./Navbar";

function Progress() {

    const [history, setHistory] = useState([]);

    // Load BMI history from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem("bmiHistory");
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);


    const totalRecords = history.length;

    const latestBMI = history.length > 0 ? history[history.length - 1].bmi : null;

    const averageBMI = history.length > 0 ?
        (history.reduce((sum, item) => sum + parseFloat(item.bmi), 0) / history.length).toFixed(2) : null;
    
    
    // Delete single record 
    const handleDelete = (indextoDelete) => {
        const updatedHistory = history.filter((_, index) => index !== indextoDelete);
        
        setHistory(updatedHistory);
        localStorage.setItem("bmiHistory", JSON.stringify(updatedHistory));
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                background: "linear-gradient(to bottom, #0f172a, #1e293b)",
                color: "white",
                padding: "60px",
                boxSizing: "border-box",
            }}
        >
            <h1 style={{ fontSize: "22px" }}>
                HEALTH & FITNESS AI DASHBOARD
            </h1>
            <Navbar />

            <div
                style={{
                    maxWidth: "800px",
                    margin: "80px auto",
                    background: "rgba(255,255,255,0.05)",
                    padding: "40px",
                    borderRadius: "15px",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
                     Progress Tracking
                </h2>

                {history.length > 0 && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "30px",
                            gap: "15px",
                            flexWrap: "wrap",
                        }}
                    >
                        <div className="stat-card">
                            <p>Total Records</p>
                            <h3>{totalRecords}</h3>
                        </div>

                        <div className="stat-card">
                            <p>Latest BMI</p>
                            <h3>{latestBMI}</h3>
                        </div>

                        <div className="stat-card">
                            <p>Average BMI</p>
                            <h3>{averageBMI}</h3>
                        </div>
                    </div>
                )}


                {history.length === 0 ? (
                    <p style={{ textAlign: "center", opacity: "0.7" }}>
                        No BMI records yet.
                    </p>
                ) : (
                    <ul>
                        {history.map((item, index) => (
                            <li key={index} style={{
                                marginBottom: "10px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <span>

                                    {item.date} - {item.time} → BMI: {item.bmi} ({item.category})

                                </span>

                                {/* DELETE BUTTON  */}
                                <button
                                    onClick={() => handelDelete(index)}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        color: "#ef4444",
                                        cursor: "pointer",
                                        fontWeight: "bold"
                                    }}
                                >
                                    DELETE
                                </button>






                                
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Progress;
