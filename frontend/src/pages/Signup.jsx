import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { API_URL } from "../config";

function Signup() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState("");

    const navigate = useNavigate();

    const checkStrength = (pass) => {
        if (pass.length < 6) {
            setStrength("Weak");
        } else if (
            pass.match(/[A-Z]/) &&
            pass.match(/[0-9]/) &&
            pass.length >= 8
        ) {
            setStrength("Strong");
        } else {
            setStrength("Medium");
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${API_URL}/api/auth/signup`,
                {
                    name,
                    email,
                    password
                }
            );

            alert("Signup Successful ✅");
            navigate("/"); // go to login page

        } catch (error) {
            console.error(error);
            alert("Signup Failed ❌");
        }
    };

    return (
        <div style={{
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
                textAlign: "center",
                width: "100%",
                maxWidth: "350px",
            }}>

                <h2 style={{ marginBottom: "20px" }}>Signup</h2>

                <form onSubmit={handleSignup}>

                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "15px",
                            borderRadius: "6px",
                            border: "none"
                        }}
                    />

                    <input
                        type="email"
                        placeholder="Email"
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

                    <div style={{ position: "relative", width: "100%", marginBottom: "20px" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                checkStrength(e.target.value);
                            }}
                            style={{
                                width: "100%",
                                padding: "10px",
                                paddingRight: "40px", // space for eye icon
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

                    {password && (
                        <p style={{
                            fontSize: "14px",
                            marginBottom: "10px",
                            color:
                                strength === "Weak"
                                    ? "red"
                                    : strength === "Medium"
                                        ? "orange"
                                        : "lightgreen"
                        }}>
                            Strength: {strength}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="primary-btn"

                        style={{
                            width: "50%",
                            padding: "10px",
                            borderRadius: "15px",
                            border: "none",
                            background: "#3b82f6",
                            color: "white",
                            cursor: "pointer",
                        }}
                    >
                        SIGNUP
                    </button>
                </form>

                <p style={{ marginTop: "20px" }}>
                    Already have an account?{" "}
                    <Link to="/" style={{ color: "#3b82f6" }}>
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Signup;
