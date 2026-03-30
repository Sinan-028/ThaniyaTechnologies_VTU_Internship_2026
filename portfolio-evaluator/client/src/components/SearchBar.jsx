import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate(); 

  const handleSearch = () => {
    if (username.trim()) {
      navigate(`/profile/${username}`);
    };
  };

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;