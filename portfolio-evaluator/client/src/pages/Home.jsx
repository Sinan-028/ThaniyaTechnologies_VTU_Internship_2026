import SearchBar from "../components/SearchBar";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container">
      <h1 className="title">Developer Portfolio Evaluator</h1>

      <SearchBar />

      {/*  Compare Button */}
      <Link to="/compare">
        <button style={{ marginTop: "20px" }}>
          ⚖️ Compare Developers
        </button>
      </Link>
    </div>
  );
};

export default Home;