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

  return (
    <div className="container">
      <h2>Compare Developers</h2>

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

      <button onClick={handleCompare}>Compare</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data1 && data2 && (
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <div className="profile-card">
            <h3>{data1.username}</h3>
            <p>Score: {data1.scores?.overall}</p>
            <p>Followers: {data1.followers}</p>
          </div>

          <div className="profile-card">
            <h3>{data2.username}</h3>
            <p>Score: {data2.scores?.overall}</p>
            <p>Followers: {data2.followers}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;