import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    navigate(`/search/${search}`);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <button className={styles.logoButton} onClick={() => navigate("/")}>
          <img src="/youtube_logo.png" alt="logo" />
        </button>
      </div>
      <div className={styles.search}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          <FaSearch />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
