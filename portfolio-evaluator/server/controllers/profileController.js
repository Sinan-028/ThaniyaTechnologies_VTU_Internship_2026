const githubService = require("../services/githubService");
const scoringService = require("../services/scoringService");
const Report = require("../models/Report");

exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;

    console.log("Fetching GitHub user...");
    const user = await githubService.getUser(username);

    if (!user) {
      return res.status(404).json({ error: "GitHub user not found" });
    }

    console.log("Fetching repos...");
    const repos = await githubService.getRepos(username) || [];

    console.log("Calculating scores...");
    const scores = scoringService.calculateScores(user, repos);

    console.log("Saving to DB...");
    await Report.findOneAndUpdate(
      { username: user.login },
      {
        username: user.login,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        followers: user.followers,
        publicRepos: user.public_repos,
        scores,
      },
      { upsert: true, new: true }
    );

    console.log("Sending response...");

    res.json({
      username: user.login,
      avatar: user.avatar_url,
      bio: user.bio,
      followers: user.followers,
      publicRepos: user.public_repos,

      scores,

      repos: repos.map(repo => ({
        name: repo.name,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        language: repo.language || "Unknown",
      })),
    });

  } catch (error) {
    console.error("ERROR:", error.message); // 🔥 IMPORTANT
    res.status(500).json({ error: error.message });
  }
};