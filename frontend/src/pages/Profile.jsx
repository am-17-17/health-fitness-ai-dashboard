import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {

    const [user, setUser] = useState(null);

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
                    `${import.meta.env.VITE_API_URL}/api/auth/profile`, {
                    headers: {
                    Authorization: `Bearer ${token}`
                    }
                }
                );

                setUser(response.data);

            } catch (error) {
                console.error(error);
                navigate("/");
                
            }
        };

        fetchProfile();
    }, [navigate]);






      


    return (

        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(to bottom, #0f172a, #1e293b)",
                color: "white",
                padding: "100px",
                boxSizing: "border-box",
            }}>
            <h1 style={{
                marginBottom: "40px", alignItems: "center",
                justifyContent:"center",display:"flex",
             }}>
                My Profile
            </h1>

            <div className="page-content">

                {user ? (
                    <>
                <p><strong>Name : </strong>{user.name }</p>

                        <p><strong>Email : </strong>{user.email}</p>
                        
                    </>
                ) : (
                    <p>Loading...</p>
                )}


                <button className="primary-btn" onClick={() => navigate("/dashboard")}
                   >
                         Back to dashboard
                    
                </button>
            </div>
        </div>
        
    );
    



}
export default Profile;
