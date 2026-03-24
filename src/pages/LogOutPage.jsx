
import { useEffect, useRef } from 'react';
import { getApiUrl, API_CONFIG } from '../config/config';
import { useAuth } from '../context/useAuth.js';

const AUTH_STORAGE_KEYS = ['token', 'id', 'role'];

function clearAuthStorage() {
    AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}

function LogOut() {
    const { token, logout } = useAuth();
    const hasLoggedOut = useRef(false);
    
    useEffect(() => {
        if (hasLoggedOut.current) {
            return;
        }
        hasLoggedOut.current = true;

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