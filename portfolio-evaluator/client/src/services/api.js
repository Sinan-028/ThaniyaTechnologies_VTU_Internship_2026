import axios from "axios";

const API = `${import.meta.env.VITE_API_BASE_URL}/api/profile`;

//  Create axios instance
const api = axios.create({
  baseURL: API,
  timeout: 10000, // 10 sec timeout
});

//  Retry helper (for rate limit)
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const fetchProfile = async (username, retry = 1) => {
  try {
    if (!username || username.trim() === "") {
      throw new Error("Username is required");
    }

    const res = await api.get(`/${username}`);
    return res.data;

  } catch (error) {

    //  Handle known API errors
    if (error.response) {
      const status = error.response.status;

      //  Not found
      if (status === 404) {
        throw new Error("User not found");
      }

      //  Rate limit → retry once
      if (status === 429 && retry > 0) {
        await delay(2000); // wait 2 sec
        return fetchProfile(username, retry - 1);
      }

      if (status === 429) {
        throw new Error("Too many requests. Please wait and try again.");
      }

      //  Server error
      if (status === 500) {
        throw new Error("Server error. Please try again later.");
      }
    }

    //  Network error
    if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }

    throw new Error("Something went wrong");
  }
};