const githubService = require("../services/githubService");
const scoringService = require("../services/scoringService");
const Report = require("../models/Report");

exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;

    // 🔥 STEP 1 — Check cache
    const existingReport = await Report.findOne({ username });

    if (existingReport) {
      console.log("⚡ Returning cached data");

      return res.json({
        username: existingReport.username,
        avatar: existingReport.avatarUrl,
        bio: existingReport.bio,
        followers: existingReport.followers,
        publicRepos: existingReport.publicRepos,
        scores: existingReport.scores,

        // ✅ return repos from DB
        repos: existingReport.topRepos || [],
      });
    }

    // 🔹 Fetch from GitHub
    console.log("📡 Fetching data from GitHub...");
    const user = await githubService.getUser(username);
    const repos = await githubService.getRepos(username) || [];

    // 🔹 Calculate scores
    console.log("🧠 Calculating scores...");
    const scores = scoringService.calculateScores(user, repos);

    // 🔹 Format repos (IMPORTANT)
    const formattedRepos = repos.map(repo => ({
      name: repo.name,
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      language: repo.language || "Unknown",
    }));

    // 🔹 Save to DB (with repos ✅)
    console.log("💾 Saving report to database...");
    await Report.findOneAndUpdate(
      { username: user.login },
      {
        username: user.login,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        followers: user.followers,
        publicRepos: user.public_repos,
        scores,

        // 🔥 IMPORTANT FIX
        topRepos: formattedRepos,
      },
      { upsert: true, new: true }
    );

    console.log("✅ Sending response");

    // 🔹 Send response
    res.json({
      username: user.login,
      avatar: user.avatar_url,
      bio: user.bio,
      followers: user.followers,
      publicRepos: user.public_repos,
      scores,
      repos: formattedRepos,
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};