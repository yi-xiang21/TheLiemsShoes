// Cấu hình API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://be-theliemsshoes.onrender.com'

const API_CONFIG = {
  BASE_URL: API_BASE_URL,
    
    // Endpoints
    ENDPOINTS: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/profile'
    }
  };
  
  // Helper function để lấy full API URL
  function getApiUrl(endpoint) {
    return API_CONFIG.BASE_URL + endpoint;
  }

// Export để dùng ở các file khác
export { getApiUrl, API_CONFIG };