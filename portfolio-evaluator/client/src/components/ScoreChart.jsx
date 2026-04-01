import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const ScoreChart = ({ scores }) => {
  const data = [
    { subject: "Activity", value: scores.activity },
    { subject: "Code", value: scores.codeQuality },
    { subject: "Diversity", value: scores.diversity },
    { subject: "Community", value: scores.community },
    { subject: "Hiring", value: scores.hiringReady },
  ];

  return (
    <RadarChart cx={200} cy={200} outerRadius={120} width={400} height={400} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <PolarRadiusAxis />
      <Radar dataKey="value" />
    </RadarChart>
  );
};

export default ScoreChart;