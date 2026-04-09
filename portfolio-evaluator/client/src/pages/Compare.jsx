import { useState } from "react";
import { fetchProfile } from "../services/api";

const Compare = () => {
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [error, setError] = useState("");

  const handleCompare = async () => {
    try {
      setError("");

      if (!user1 || !user2) {
        setError("Enter both usernames");
        return;
      }

      const res1 = await fetchProfile(user1);
      const res2 = await fetchProfile(user2);

      setData1(res1);
      setData2(res2);

    } catch (err) {
      setError(err.message);
    }
  };

  const getUsername = (data) => data?.username || data?.login || "N/A";
  const getAvatar = (data) => data?.avatar || data?.avatar_url || "";
  const getFollowers = (data) => data?.followers ?? 0;
  const getRepos = (data) => data?.publicRepos ?? data?.public_repos ?? 0;
  const getScore = (data) => data?.scores?.overall ?? 0;

  return (
    <div className="container">
      <h2>⚖️ Compare Developers</h2>

      <div className="compare-inputs">
        <input
          placeholder="First username"
          value={user1}
          onChange={(e) => setUser1(e.target.value)}
        />

        <input
          placeholder="Second username"
          value={user2}
          onChange={(e) => setUser2(e.target.value)}
        />
      </div>

      <button onClick={handleCompare}>Compare</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data1 && data2 && (
        <div className="compare-grid">
          <div className="compare-card">
            <img src={getAvatar(data1)} alt="" className="avatar" />
            <h3>{getUsername(data1)}</h3>
            <p>Score: {getScore(data1)}</p>
            <p>Followers: {getFollowers(data1)}</p>
            <p>Repos: {getRepos(data1)}</p>
          </div>

          <div className="compare-card">
            <img src={getAvatar(data2)} alt="" className="avatar" />
            <h3>{getUsername(data2)}</h3>
            <p>Score: {getScore(data2)}</p>
            <p>Followers: {getFollowers(data2)}</p>
            <p>Repos: {getRepos(data2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;