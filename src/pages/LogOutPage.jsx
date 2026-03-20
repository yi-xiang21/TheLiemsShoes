
import { useEffect } from 'react';
import { getApiUrl, API_CONFIG } from '../config/config';
import { useAuth } from '../context/useAuth.js';

function LogOut() {
    const { token, logout } = useAuth();
    
    useEffect(() => {
        // Call logout API first
        const callLogoutApi = async () => {
            if (token) {
                try {
                    await fetch(getApiUrl(API_CONFIG.ENDPOINTS.LOGOUT), {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                } catch (error) {
                    console.error('Logout API error:', error);
                }
            }
        };

        // Call logout API then clear tokens and redirect
        callLogoutApi().finally(() => {
            logout();
            window.location.href = "/";
        });
    }, [token, logout]);

    return null;
}

export default LogOut;