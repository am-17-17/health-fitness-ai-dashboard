import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { API_URL } from "../config";

function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem("token");

            if (token) {
                fetch(`${API_URL}/api/auth/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then(res => res.json())
                    .then(data => setUser(data));
        }
    }, []);


    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
        window.location.reload();
    };
    return (
        <nav className="navbar"
        >
        

            {/* <Link to="/dashboard">Dashboard</Link> */}

            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>

            <NavLink to="/bmi" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>BMI Calculator</NavLink>

            <NavLink to="/recipe" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>AI Recipe</NavLink>

            <NavLink to="/workout" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>AI Workout</NavLink>

            <NavLink to="/progress" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Progress</NavLink>

            <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink>

            <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Contact</NavLink>

            <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Profile</NavLink>


          



        </nav>
        
    );
}

export default Navbar;