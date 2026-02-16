import Navbar from "./Navbar";
import Footer from "../components/Footer";

function About() {
    return (
        <div className="page">
            <Navbar />

            <div className="about-container">
                <h1>About Health & Fitness AI</h1>

                <p>
                    Health & Fitness AI is a smart web application designed to help users
                    track their BMI, discover AI-powered nutrition suggestions, and
                    generate personalized workout plans.
                </p>

                <p>
                    Our goal is to make health tracking simple, intelligent, and
                    accessible on all devices — whether desktop, tablet, or mobile.
                </p>

                <div className="about-features">
                    <div className="about-card">
                        <h3>📊 Smart Tracking</h3>
                        <p>Track BMI and monitor your progress over time.</p>
                    </div>

                    <div className="about-card">
                        <h3>🥗 AI Nutrition</h3>
                        <p>Generate meal plans based on your fitness goals.</p>
                    </div>

                    <div className="about-card">
                        <h3>🏋️ AI Workouts</h3>
                        <p>Get personalized workout suggestions instantly.</p>
                        
                    </div>
                    
                </div>
            </div>
            <Footer /> 
        </div>
       
    );
}

export default About;
