const githubService = require("../services/githubService");
const scoringService = require("../services/scoringService");
const Report = require("../models/Report");

exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;

   
    if (!username || username.trim() === "") {
      return res.status(400).json({ error: "Username is required" });
    }

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

    
    let user, repos;

    try {
      user = await githubService.getUser(username);
      repos = await githubService.getRepos(username);
    } catch (err) {
      if (err.response?.status === 404) {
        return res.status(404).json({
          error: "GitHub user not found",
        });
      }

      if (err.response?.status === 403) {
        return res.status(429).json({
          error: "GitHub API limit exceeded. Try again later.",
        });
      }

      return res.status(500).json({
        error: "Failed to fetch data from GitHub",
      });
    }

    repos = (repos || []).slice(0, 10);


    const scores = scoringService.calculateScores(user, repos) || {};

    const formattedRepos = (repos || []).map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      language: repo.language || "Unknown",
    }));

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
  console.log("🔥 ERROR:", error);   
  res.status(500).json({
    error: error.message || "Internal Server Error",
  });
}
};