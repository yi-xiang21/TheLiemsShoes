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
                setError("Không thể tải thông tin cá nhân");
            }

        };
        fetchProfile();
    }, [token]);

    if (!token) {
        return (
            <section className="user-profile user-profile--state">
                <div className="user-profile-card">
                    <h1 className="user-profile-title">Thông tin cá nhân</h1>
                    <p className="user-profile-state-text">Bạn cần đăng nhập để xem thông tin cá nhân.</p>
                    <a href="/Login" className="user-profile-action">Đến trang đăng nhập</a>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="user-profile user-profile--state">
                <div className="user-profile-card">
                    <h1 className="user-profile-title">Thông tin cá nhân</h1>
                    <p className="user-profile-state-text">{error}</p>
                </div>
            </section>
        );
    }
    
    return (
        <section className="user-profile">
            <div className="user-profile-card">
                <div className="user-profile-header">
                    <h1 className="user-profile-title">Thông tin cá nhân</h1>
                    <p className="user-profile-subtitle">Quản lý thông tin tài khoản của bạn</p>
                </div>

                <div className="user-profile-content">
                    <div className="user-profile-item">
                        <span className="user-profile-label">Email</span>
                        <span className="user-profile-value">{userEmail || "Chưa cập nhật"}</span>
                    </div>
                    <div className="user-profile-item">
                        <span className="user-profile-label">Họ tên</span>
                        <span className="user-profile-value">{userName || "Chưa cập nhật"}</span>
                    </div>
                    <div className="user-profile-item user-profile-item--last">
                        <span className="user-profile-label">Số điện thoại</span>
                        <span className="user-profile-value">{userPhone || "Chưa cập nhật"}</span>
                    </div>
                </div>

                <div className="user-profile-footer">
                    <a href="/Logout" className="user-profile-logout">Đăng xuất</a>
                </div>
            </div>
        </section>
    );
}

export default UserProfile;