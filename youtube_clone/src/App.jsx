import "./App.css";
import Navbar from "./components/navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import Search from "./components/search/Search";
import Video from "./components/video/Video";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:search" element={<Search />} />
        <Route path="/video/:videoId" element={<Video />} />
      </Routes>
    </>
  );
}

export default App;
