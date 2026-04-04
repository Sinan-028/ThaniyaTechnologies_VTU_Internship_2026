import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Report = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/profile/report/${username}`
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReport();
  }, [username]);

  if (!data) return <h2>Loading report...</h2>;

  return (
    <div className="container">
      <h1>Shared Report</h1>
      <h2>{data.username}</h2>
      <p>Score: {data.scores.overall}/100</p>
    </div>
  );
};

export default Report;