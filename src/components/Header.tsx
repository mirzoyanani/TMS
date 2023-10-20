import React, { useState } from "react";
import styles from "../css/header.module.css";
import { useNavigate } from "react-router-dom";
interface HeaderProps {
  onSearch: (inputValue: string) => void;
  setSearchValue: (searchValue: string) => void;
}
const Header: React.FC<HeaderProps> = ({ onSearch, setSearchValue }) => {
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  function handleRelod() {
    location.reload();
  }

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleMenuItemClick = (route: string) => {
    navigate(route);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  function handleLogUot() {
    navigate("/");
    localStorage.removeItem("token");
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo} onClick={handleRelod}>
          T M S
        </div>
      </div>
      <div className={styles.search}>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className={styles.header_input}
            placeholder="Search"
            value={inputValue}
            onChange={handleSearchInput}
          />
          <button className={styles.searchButton}>Search</button>
        </form>
      </div>
      <div className={styles.right}>
        <div className={styles.userIcon} onClick={toggleDropdown}>
          <i className="fa fa-user-circle" aria-hidden="true"></i>
        </div>
        {isDropdownOpen && (
          <div className={styles.dropdown}>
            <ul>
              <li onClick={() => handleMenuItemClick("/user")}>Profile</li>
              <li onClick={() => handleMenuItemClick("/statistics")}>Statistics</li>
              <li onClick={handleLogUot}>Log out</li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
