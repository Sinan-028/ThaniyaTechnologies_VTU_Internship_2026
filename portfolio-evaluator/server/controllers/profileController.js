const githubService = require("../services/githubService");
const scoringService = require("../services/scoringService");
const Report = require("../models/Report");

exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;

    // 🔹 Validate input
    if (!username || username.trim() === "") {
      return res.status(400).json({ error: "Username is required" });
    }

    //  STEP 1 — Check cache FIRST
    const existingReport = await Report.findOne({ username }).lean();

    if (existingReport) {
      return res.json({
        username: existingReport.username,
        avatar: existingReport.avatarUrl,
        bio: existingReport.bio,
        followers: existingReport.followers,
        publicRepos: existingReport.publicRepos,
        scores: existingReport.scores,
        repos: existingReport.topRepos || [],
      });
    }

    // 🔹 STEP 2 — Fetch from GitHub
    let user, repos;

    try {
      user = await githubService.getUser(username);
      repos = await githubService.getRepos(username);
    } catch (err) {

      //  User not found
      if (err.response?.status === 404) {
        return res.status(404).json({
          error: "GitHub user not found",
        });
      }

      //  API LIMIT HANDLING (IMPORTANT FIX)
      if (err.response?.status === 403) {
        const cached = await Report.findOne({ username }).lean();

        if (cached) {
          return res.json({
            username: cached.username,
            avatar: cached.avatarUrl,
            bio: cached.bio,
            followers: cached.followers,
            publicRepos: cached.publicRepos,
            scores: cached.scores,
            repos: cached.topRepos || [],
            message: "Showing cached data due to API limit",
          });
        }

        return res.status(429).json({
          error: "GitHub API limit exceeded. Try again later.",
        });
      }

      return res.status(500).json({
        error: "Failed to fetch data from GitHub",
      });
    }

    //  STEP 3 — Limit repos
    repos = (repos || []).slice(0, 10);

    // STEP 4 — Calculate scores
    const scores = scoringService.calculateScores(user, repos) || {};

    //  STEP 5 — Format repos
    const formattedRepos = (repos || []).map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      language: repo.language || "Unknown",
    }));

    // STEP 6 — Save to DB
    await Report.findOneAndUpdate(
      { username: user.login },
      {
        username: user.login,
        avatarUrl: user.avatar_url,
        bio: user.bio || "",
        followers: user.followers || 0,
        publicRepos: user.public_repos || 0,
        scores,
        topRepos: formattedRepos,
      },
      { upsert: true, new: true }
    );

    //  STEP 7 — Send response
    res.json({
      username: user.login,
      avatar: user.avatar_url,
      bio: user.bio || "No bio available",
      followers: user.followers || 0,
      publicRepos: user.public_repos || 0,
      scores,
      repos: formattedRepos,
    });

  } catch (error) {
    console.error("❌ Server Error:", error.message);

    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};