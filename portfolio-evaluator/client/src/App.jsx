import { BrowserRouter as Router, Routes, Route }from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Report from "./pages/Report";

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element= {<Home />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/report/:username" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;