import { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl } from "../config/config.js";
import "../assets/css/userProfile.css"

function UserProfile () {
    const token = localStorage.getItem("token");
    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            return;
        }   
        
        const fetchProfile = async () => {
            try {
                const response = await axios.get(getApiUrl("/auth/profile"), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserEmail(response.data?.user?.email || "");
                setUserName(response.data?.user?.username || "");
                setUserPhone(response.data?.user?.phone_number || "");
            }
            catch {
                setError("Unable to load profile information");
            }

        };
        fetchProfile();
    }, [token]);

    if (!token) {
        return (
            <section className="user-profile user-profile--state">
                <div className="user-profile-card">
                    <h1 className="user-profile-title">Profile Information</h1>
                    <p className="user-profile-state-text">You need to log in to view your profile information.</p>
                    <a href="/Login" className="user-profile-action">Go to Login</a>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="user-profile user-profile--state">
                <div className="user-profile-card">
                    <h1 className="user-profile-title">Profile Information</h1>
                    <p className="user-profile-state-text">{error}</p>
                </div>
            </section>
        );
    }
    
    return (
        <section className="user-profile">
            <div className="user-profile-card">
                <div className="user-profile-header">
                    <h1 className="user-profile-title">Profile Information</h1>
                    <p className="user-profile-subtitle">Manage your account details</p>
                </div>

                <div className="user-profile-content">
                    <div className="user-profile-item">
                        <span className="user-profile-label">Email</span>
                        <span className="user-profile-value">{userEmail || "Not updated"}</span>
                    </div>
                    <div className="user-profile-item">
                        <span className="user-profile-label">Full Name</span>
                        <span className="user-profile-value">{userName || "Not updated"}</span>
                    </div>
                    <div className="user-profile-item user-profile-item--last">
                        <span className="user-profile-label">Phone Number</span>
                        <span className="user-profile-value">{userPhone || "Not updated"}</span>
                    </div>
                </div>

                <div className="user-profile-footer">
                    <a href="/my-orders" className="user-profile-action">
                        Order History
                    </a>
                    <a href="/Logout" className="user-profile-logout">Log Out</a>
                </div>
            </div>
        </section>
    );
}

export default UserProfile;