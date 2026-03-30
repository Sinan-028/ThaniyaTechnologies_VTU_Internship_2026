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
  </div>
);
};

export default Profile;