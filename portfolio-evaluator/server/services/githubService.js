const axios = require("axios");

const BASE_URL = "https://api.github.com";

exports.getUser = async (username) => {
    const res = await axios.get(`${BASE_URL}/users/${username}`);
    return res.data;
};

exports.getRepos = async (username) => {
    const res = await axios.get(`${BASE_URL}/users/${username}/repos`);
    return res.data;
};
