import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${API_URL}/api/auth/login`,
                { email, password }
            );

            console.log("Login Response:", response);

            // Check if token exists
            if (response.data && response.data.token) {
                localStorage.setItem("token", response.data.token);
                alert("Login Successful ✅");
                navigate("/");
            } else {
                alert("Invalid credentials ❌");
            }

        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message);

            alert(
                error.response?.data?.message || "Login Failed ❌"
            );
        }
    };

    return (

       


        <div className="page">
            <h1 className="main-heading">
                HEALTH AND FITNESS AI
            </h1>
            <div className="auth-card">

                <h2>Welcome back</h2>
                <p style={{ opacity: 0.7, marginBottom: "20px" }}>
                    Login to continue
                </p>

                <button className="google-btn">
                    <FcGoogle size={20} style={{ marginRight: "10px" }} />
                    Login with Google
                </button>

                <div style={{ margin: "20px 0", opacity: 0.5 }}>
                    Or continue with
                </div>

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div style={{ position: "relative" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ paddingRight: "40px" }}
                        />

                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer"
                            }}
                        >
                            {showPassword ? <FaEyeSlash color="#555"  /> : <FaEye color="#555" />}
                        </span>
                    </div>

                    <button type="submit" className="primary-btn">
                        Login
                    </button>
                </form>

            </div>
        </div>
    );
}

export default Login;