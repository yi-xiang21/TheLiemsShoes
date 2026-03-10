// Cấu hình API URL
const API_CONFIG = {
    // BASE_URL: 'http://localhost:3000',
    BASE_URL: 'https://be-theliemsshoes.onrender.com',
    
    // Endpoints
    ENDPOINTS: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout'
    }
  };
  
  // Helper function để lấy full API URL
  function getApiUrl(endpoint) {
    return API_CONFIG.BASE_URL + endpoint;
  }

// Export để dùng ở các file khác
export { getApiUrl, API_CONFIG };