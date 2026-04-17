import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProfile } from "../services/api";
import ScoreChart from "../components/ScoreChart";
import LanguageChart from "../components/LanguageChart";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Profile = () => {
  const { username } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    const getData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchProfile(username);
        setData(result);

      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [username]);

  //  Download PDF 
  const downloadPDF = async () => {
    const element = document.querySelector(".container");

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`${data.username}-report.pdf`);
  };

  //  Save to favorites 
  const saveFavorite = () => {
    const existing = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!existing.includes(data.username)) {
      const updated = [...existing, data.username];
      localStorage.setItem("favorites", JSON.stringify(updated));
      alert("Saved to favorites!");
    } else {
      alert("Already saved!");
    }
  };

  // 🔹 UI States
  if (loading) {
    return <h2 style={{ textAlign: "center" }}>⏳ Loading profile...</h2>;
  }

  if (error) {
    return <h2 style={{ color: "red", textAlign: "center" }}>{error}</h2>;
  }

  if (!data && !loading && !error) {
    return <h2 style={{ textAlign: "center" }}>Search for a GitHub user</h2>;
  }

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
          Score: {data.scores?.overall || 0}/100
        </div>

        {/*  Buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginTop: "10px" }}>
          
          <button onClick={() => window.open(`/report/${data.username}`, "_blank")}>
            🔗 Share
          </button>

          <button onClick={downloadPDF}>
            📄 Download
          </button>

          <button onClick={saveFavorite}>
            ⭐ Save
          </button>

        </div>
      </div>

      {/* 🔹 Score Breakdown */}
      <h2 style={{ marginTop: "30px" }}>Score Breakdown</h2>

      <div className="score-grid">
        {[
          ["Activity", data.scores?.activity],
          ["Code Quality", data.scores?.codeQuality],
          ["Diversity", data.scores?.diversity],
          ["Community", data.scores?.community],
          ["Hiring Ready", data.scores?.hiringReady],
        ].map(([label, value]) => (
          <div key={label} className="score-card">
            <p>{label}</p>
            <h3>{value || 0}</h3>
          </div>
        ))}
      </div>

      {/* 🔹 Charts */}
      <h2 style={{ marginTop: "30px" }}>Score Visualization</h2>
      <div className="chart-container">
        <ScoreChart scores={data.scores || {}} />
      </div>

      <h2 style={{ marginTop: "30px" }}>Language Usage</h2>
      <div className="chart-container">
        <LanguageChart repos={data.repos || []} />
      </div>

      {/* 🔹 Repo Section */}
      <h2 style={{ marginTop: "30px" }}>Top Repositories</h2>

      <div className="repo-list">
        {data.repos?.length > 0 ? (
          data.repos.slice(0, 6).map((repo) => (
            <div key={repo.name} className="repo-card">
              <h3>{repo.name}</h3>
              <p>⭐ {repo.stars} | 🍴 {repo.forks}</p>
              <p>🧠 {repo.language}</p>
            </div>
          ))
        ) : (
          <p>No repositories available</p>
        )}
      </div>

    </div>
  );
};

export default Profile;