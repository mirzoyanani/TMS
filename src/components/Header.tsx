import React, { useState } from "react";
import styles from "../css/header.module.css";

const Header: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleMenuItemClick = (route: string) => {
    console.log(`Navigating to: ${route}`);
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo}>T M S</div>
      </div>
      <div className={styles.search}>
        <input type="text" placeholder="Search" />
        <button className={styles.searchButton}>Search</button>
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
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
