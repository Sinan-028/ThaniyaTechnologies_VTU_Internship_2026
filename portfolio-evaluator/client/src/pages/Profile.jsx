import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProfile } from "../services/api";

const Profile = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchProfile(username);
        setData(result);
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, [username]);

  if (!data) return <h2>Loading...</h2>;

  return (
    <div className="container">
      
      {/* 🔹 Profile Card */}
      <div className="profile-card">
        <h2>{data.username}</h2>

        <img src={data.avatar} alt="avatar" className="avatar" />

        <p className="bio">{data.bio || "No bio available"}</p>

        <div className="stats">
          <div>
            <p>Followers</p>
            <strong>{data.followers}</strong>
          </div>

          <div>
            <p>Repos</p>
            <strong>{data.publicRepos}</strong>
          </div>
        </div>

        <div className="score">
          Score: {data.scores.overall}/100
        </div>
      </div>

      {/* 🔹 Score Breakdown (Day 11) */}
      <h2 style={{ marginTop: "30px" }}>Score Breakdown</h2>

      <div className="score-grid">
        <div className="score-card">
          <p>Activity</p>
          <h3>{data.scores.activity}</h3>
        </div>

        <div className="score-card">
          <p>Code Quality</p>
          <h3>{data.scores.codeQuality}</h3>
        </div>

        <div className="score-card">
          <p>Diversity</p>
          <h3>{data.scores.diversity}</h3>
        </div>

        <div className="score-card">
          <p>Community</p>
          <h3>{data.scores.community}</h3>
        </div>

        <div className="score-card">
          <p>Hiring Ready</p>
          <h3>{data.scores.hiringReady}</h3>
        </div>
      </div>

      {/* 🔹 Repo Section */}
      <h2 style={{ marginTop: "30px" }}>Top Repositories</h2>

      <div className="repo-list">
        {data.repos?.slice(0, 6).map((repo, index) => (
          <div key={index} className="repo-card">
            <h3>{repo.name}</h3>
            <p>⭐ {repo.stars} | 🍴 {repo.forks}</p>
            <p>🧠 {repo.language}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;