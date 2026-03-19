import { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl } from "../config/config";
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
        return <p>Bạn cần đăng nhập để xem thông tin cá nhân</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }
    
    return (
        <section className="user-profile">
            <h1>Thông tin cá nhân</h1>
            <p><strong>Email:</strong> {userEmail}</p>
            <p><strong>Họ tên:</strong> {userName}</p>
            <p><strong>Số điện thoại:</strong> {userPhone}</p>
        </section>
    );
}

export default UserProfile;