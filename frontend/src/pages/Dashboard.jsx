import { useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import Navbar from "./Navbar";
import Footer from "../components/Footer";


function Dashboard() {

    

    const cardStyle = {
        background: "rgba(255,255,255,0.05)",
        padding: "25px",
        borderRadius: "12px",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.1)",
        transition: "all 0.3s ease",
        cursor: "pointer"
    };

    const handleMouseEnter = (e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
    };

    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);



    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);
    
    

    // Navigate from dashboard to login
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    }


    return (
        <div className="page">

            {/* Top Header Section */}
            <div className="container" style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: "30px"
            }}>
                <h1 style={{ fontSize: "22px" }}>
                    HEALTH & FITNESS AI DASHBOARD
                </h1>

                {!isLoggedIn ? (
                    <button
                        className="primary-btn"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            setIsLoggedIn(false);
                            navigate("/", { replace: true });
                        }}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "6px",
                            border: "none",
                            background: "#ef4444",
                            color: "white",
                            cursor: "pointer",
                        }}
                    >
                        Logout
                    </button>
                )}
            </div>

            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <div className="container hero">

                <h1>
                    Your Health Journey Starts Here
                </h1>

                <p>
                    Track your BMI, discover personalized nutrition recommendations,
                    and monitor your progress with our comprehensive health platform.
                </p>

                <button
                    className="primary-btn"
                    onClick={() => navigate("/bmi")}
                >
                    Get Started →
                </button>

                {/* Cards */}
                <div className="card-grid">

                    <div className="card" onClick={() => navigate("/bmi")}>
                        <h3>🧮 BMI Calculator</h3>
                        <p>Calculate and track your Body Mass Index easily.</p>
                    </div>

                    <div className="card" onClick={() => navigate("/recipe")}>
                        <h3>🥗 AI Recipes</h3>
                        <p>Discover healthy and personalized meal plans.</p>
                    </div>

                    <div className="card" onClick={() => navigate("/workout")}>
                        <h3>🏋️ AI Workout</h3>
                        <p>Get AI-generated workouts tailored to your goals.</p>
                    </div>

                    <div className="card" onClick={() => navigate("/progress")}>
                        <h3>📊 Progress Tracking</h3>
                        <p>Monitor your fitness journey over time.</p>
                    </div>

                </div>

            </div>
            <Footer />

        </div>
    );

}

export default Dashboard;