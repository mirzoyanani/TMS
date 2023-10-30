import { FormEvent, useState } from "react";
import styles from "../../css/generalPage.module.css";
import format from "date-fns/format";
import { HOST_NAME } from "../../lib";
import axios from "axios";
interface Props {
  getTasksbyStatus: () => void;
  getTasks: () => void;
  onClose: () => void;
  token: string | null;
}
const TaskCreate = ({ token, getTasksbyStatus, getTasks, onClose }: Props) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    endDate: "",
  });
  const createTask = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const dateObject = new Date(newTask.endDate);
    const formattedTimestamp = format(dateObject, "yyyy-MM-dd HH:mm:ss");

    try {
      await axios.post(
        `${HOST_NAME}/task`,
        {
          title: newTask.title,
          description: newTask.description,
          end_date: formattedTimestamp,
        },
        {
          headers: { token },
        },
      );
      if (status) {
        getTasksbyStatus();
      } else {
        getTasks();
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    onClose();
  };

  return (
    <div>
      <h2 className={styles.modal_title}>Create a New Task</h2>
      <button className={styles.modal_btn_close} type="button" onClick={onClose}>
        X
      </button>
      <form onSubmit={createTask} className={styles.modal_form}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            className={styles.newTaskTitle}
            type="text"
            maxLength={32}
            id="title"
            name="title"
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            required
            typeof="text"
            maxLength={36}
            id="description"
            name="description"
            className={styles.discription_area}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <label htmlFor="endDate">End Date and Time:</label>
          <input
            className={styles.task_date}
            type="datetime-local"
            id="endDate"
            name="endDate"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.btns}>
          <button className={styles.modal_btn}>Create Task</button>
        </div>
      </form>
    </div>
  );
};

export default TaskCreate;
