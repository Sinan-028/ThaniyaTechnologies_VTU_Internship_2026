import axios from "axios";

const API = `${import.meta.env.VITE_API_BASE_URL}/api/profile`;

export const fetchProfile = async (username) => {
    try {
        const res = await axios.get(`${API}/${username}`);
        return res.data;
    } catch (error) {
        console.error("API ERROR:", error.response?.data || error.message);
        throw error; 
    }
};