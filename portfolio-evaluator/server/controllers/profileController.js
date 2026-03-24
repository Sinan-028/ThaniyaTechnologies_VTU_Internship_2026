const githubService = require("../services/githubService");
const scoringService = require("../services/scoringService");

exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await githubService.getUser(username);
    const repos = await githubService.getRepos(username);
    const scores = scoringService.calculateScores(user, repos);

    res.json({
      username: user.login,
      avatar: user.avatar_url,
      bio: user.bio,
      followers: user.followers,
      publicRepos: user.public_repos,

      scores, 

      repos: repos.map(repo => ({
        name: repo.name,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
      })),
    });

  } catch (error) {
    res.status(500).json({ error: "User not found" });
  }
};