import TaskStatusChart from "../components/TaskStatusChart";
import styles from "../css/statistics.module.css";
import { useNavigate } from "react-router-dom";
const Statistics = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.main}>
      <div className={styles.header} onClick={() => navigate("/general")}>
        {" "}
        T M S{" "}
      </div>
      <div className={styles.structure}>
        <TaskStatusChart />
      </div>
    </div>
  );
};

export default Statistics;
