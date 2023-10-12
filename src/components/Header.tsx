import React, { useState } from "react";
import styles from "../css/header.module.css";
import axios from "axios";
import { HOST_NAME } from "../lib";
import { setTasks } from "../redux/reducers/tasksSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  //   const [page, setPage] = useState(1);
  //   const [status, setStatus] = useState("");
  const page = 1;
  const pageItemsCount = 12;
  const handleMenuItemClick = (route: string) => {
    navigate(route);
  };
  async function searchTasks(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    {
      e.preventDefault();
      try {
        const response = await axios.get(
          `${HOST_NAME}/task/search?title=${inputValue}&?page=${page}&pageSize=${pageItemsCount}`,
          {
            headers: { token },
          },
        );

        dispatch(setTasks(response.data.data.items));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
  }
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo}>T M S</div>
      </div>
      <div className={styles.search}>
        <form onSubmit={searchTasks}>
          <input type="text" placeholder="Search" onChange={(e) => setInputValue(e.target.value)} />
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
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
