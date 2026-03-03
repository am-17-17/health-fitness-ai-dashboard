import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

function Profile() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/");
                    return;
                }

                const response = await axios.get(
                    `${API_URL}/api/auth/profile`, {
                    headers: {
                    Authorization: `Bearer ${token}`
                    }
                }
                );

                setUser(response.data);
                setLoading(false);

            } catch (error) {
                console.error(error);
                setLoading(false);
                navigate("/");
                
            }
        };

        fetchProfile();
    }, []);






      


    return (

        <div className="page">

            <div className="page-content">

                <h1 style={{ marginBottom: "30px", textAlign: "center" }}>
                    My Profile
                </h1>

                 {
                    loading?(
    <p style = {{ textAlign: "center" }} > Loading...</p>
            ) : user ? (
            <div className="profile-card">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>

                <button
                    className="primary-btn"
                    style={{ marginTop: "20px", width: "100%" }}
                    onClick={() => navigate("/dashboard")}
                >
                    Back to Dashboard
                </button>
            </div>
            ) : (
            <p style={{ textAlign: "center" }}>User not found</p>
)}

            </div>

        </div>
    );
        
    
    



}
export default Profile;
