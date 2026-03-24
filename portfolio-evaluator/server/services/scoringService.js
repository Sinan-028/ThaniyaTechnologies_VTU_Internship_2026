exports.calculateScores = (user, repos) => {
 
  const activityScore = Math.min(repos.length * 2, 25);

  let codeQuality = 0;
  repos.forEach(repo => {
    if (repo.description) codeQuality += 2;
    if (repo.license) codeQuality += 1;
  });
  codeQuality = Math.min(codeQuality, 20);

 
  const languages = new Set();
  repos.forEach(repo => {
    if (repo.language) languages.add(repo.language);
  });
  const diversityScore = Math.min(languages.size * 2, 20);

 
  let totalStars = 0;
  repos.forEach(repo => {
    totalStars += repo.stargazers_count;
  });
  const communityScore = Math.min(
    (totalStars / 50) + (user.followers / 10),
    20
  );

 
  let hiringReady = 0;
  if (user.bio) hiringReady += 5;
  if (user.blog) hiringReady += 5;
  if (user.email) hiringReady += 5;

  hiringReady = Math.min(hiringReady, 15);

 
  const overall =
    activityScore +
    codeQuality +
    diversityScore +
    communityScore +
    hiringReady;

  return {
    activity: Math.round(activityScore),
    codeQuality: Math.round(codeQuality),
    diversity: Math.round(diversityScore),
    community: Math.round(communityScore),
    hiringReady: Math.round(hiringReady),
    overall: Math.round(overall),
  };
};