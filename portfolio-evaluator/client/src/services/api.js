import axios from "axios";

const API = `${import.meta.env.VITE_API_BASE_URL}/api/profile`;

export const fetchProfile = async (username) => {
  try {
    if (!username || username.trim() === "") {
      throw new Error("Username is required");
    }

    const res = await axios.get(`${API}/${username}`);
    return res.data;

  } catch (error) {

    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("User not found");
      }

      if (error.response.status === 429) {
        throw new Error("API limit reached. Try again later");
      }

      if (error.response.status === 500) {
        throw new Error("Server error. Please try again");
      }
    }

    throw new Error("Something went wrong");
  }
};