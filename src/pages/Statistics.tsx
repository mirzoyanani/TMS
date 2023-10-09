import { HOST_NAME } from "../lib";
import { useEffect } from "react";
import TaskStatusChart from "../components/TaskStatusChart";
import { useDispatch } from "react-redux";
import axios from "axios";
import styles from "../css/statistics.module.css";
import { setAllStatuses } from "../redux/reducers/tasksSlice";
const Statistics = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  useEffect(() => {
    async function getStatuses() {
      try {
        const response = await axios.get(`${HOST_NAME}/statistics`, {
          headers: { token },
        });
        dispatch(setAllStatuses(response.data.data.items));
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    }
    getStatuses();
  }, [dispatch, token]);

  return (
    <div className={styles.main}>
      <div className={styles.header}> T M S </div>
      <div className={styles.structure}>
        <TaskStatusChart />
      </div>
    </div>
  );
};

export default Statistics;
