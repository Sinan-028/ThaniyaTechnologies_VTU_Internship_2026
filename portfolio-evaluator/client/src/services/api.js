import axios from "axios";

const API = "http://localhost:5000/api/profile";

export const fetchProfile = async (username) => {
    const res = await axios.get(`${API}/${username}`);
    return res.data;
};
