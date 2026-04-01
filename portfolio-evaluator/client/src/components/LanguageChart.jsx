import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const LanguageChart = ({ repos }) => {
  const languageCount = {};

  repos.forEach(repo => {
    if (repo.language) {
      languageCount[repo.language] =
        (languageCount[repo.language] || 0) + 1;
    }
  });

  const data = Object.keys(languageCount).map(lang => ({
    language: lang,
    count: languageCount[lang],
  }));

  return (
    <BarChart width={400} height={300} data={data}>
      <XAxis dataKey="language" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" />
    </BarChart>
  );
};

export default LanguageChart;