import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";


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
                navigate("/dashboard");
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
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(to bottom, #0f172a, #1e293b)",
                color: "white"
            }}>
            
            <div style={{
                background: "rgba(255,255,255,0.05)",
                padding: "40px",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
                width: "350px",
                textAlign: "center"
            }}>
            


                <h2 style={{ marginBottom: "20px" }}>Login</h2>

            <form onSubmit={handelLogin}>
                <input type="email"
                    placeholder="EMAIL"
                    value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "15px",
                            borderRadius: "6px",
                            border: "none"
                        }}
                />
                <br /><br />

                    <div style={{ position: "relative", width: "100%", marginBottom: "20px" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="PASSWORD"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                paddingRight: "40px",
                                borderRadius: "6px",
                                border: "none"
                            }}
                        />

                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                fontSize: "16px"
                            }}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </span>
                    </div>

                <br /><br />

                    <button type="submit"
                        className="primary-btn"
                        style={{
                            width: "50%",
                            padding: "10px",
                            borderRadius: "15px",
                            border: "none",
                            background: "#3b82f6",
                            color: "white",
                            cursor: "pointer"
                        }}
                    >LOGIN
                    </button>

                    <button
                        onClick={() => {
                            window.location.href = `${API_URL}/api/auth/google`;
                        }}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "10px",
                            borderRadius: "6px",
                            border: "none",
                            background: "#db4437",
                            color: "white",
                            cursor: "pointer"
                        }}
                    >
                        Login with Google
                    </button>

            </form>

                <p style={{ marginTop: "20px" }}>
                    New user? <Link to="/signup" style={{ color: "#3b82f6" }}>SIGNUP</Link>
                </p>
                
        
            </div>
        </div>
    );
}

export default Login;