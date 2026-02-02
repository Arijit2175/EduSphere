import API_URL from "../config";

let isSessionExpired = false;

// Enhanced fetch wrapper that handles session expiration
export const fetchWithAuth = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    
    // Check for 401 Unauthorized (session expired)
    if (response.status === 401 && !isSessionExpired) {
      isSessionExpired = true;
      
      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("enrolledCourses");
      
      // Show session expired message
      alert("Session has expired. Please log in again.");
      
      // Redirect to login page
      window.location.href = "/login";
      
      throw new Error("Session expired");
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Helper to get auth headers
export const getAuthHeaders = () => {
  const user = localStorage.getItem("user");
  if (user) {
    const { access_token } = JSON.parse(user);
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    };
  }
  return {
    "Content-Type": "application/json",
  };
};

// Helper to make authenticated API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: getAuthHeaders(),
    ...options,
  };
  
  return fetchWithAuth(url, defaultOptions);
};
