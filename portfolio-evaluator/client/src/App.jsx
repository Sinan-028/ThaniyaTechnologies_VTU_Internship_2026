import { BrowserRouter as Router, Routes, Route }from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Report from "./pages/Report";
import Compare from "./pages/Compare";

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element= {<Home />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/report/:username" element={<Report />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </Router>
  );
}

export default App;