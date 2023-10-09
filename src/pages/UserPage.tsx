import Header from "../components/Header";
import styles from "../css/userPage.module.css";
import { HOST_NAME } from "../lib";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setTasks } from "../redux/reducers/tasksSlice";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/persistReducer";
import TaskCard from "../components/TaskCard";
import Modal from "react-modal";
Modal.setAppElement("#root");
const UserPage = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const pageItemsCount = 10;
  const tasks = useSelector((state: RootState) => state.task.tasks);
  //   console.log(tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    endDate: "",
  });
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const createTask = () => {
    closeModal();
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  useEffect(() => {
    async function getTasks() {
      try {
        const response = await axios.get(`${HOST_NAME}/task?page=${page}&pageSize=${pageItemsCount}`, {
          headers: { token },
        });
        dispatch(setTasks(response.data.data.items));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
    async function getTasksbyStatus() {
      try {
        const response = await axios.get(
          `${HOST_NAME}/task/status?page=${page}&pageSize=${pageItemsCount}&status=${status}`,
          {
            headers: { token },
          },
        );
        dispatch(setTasks(response.data.data.items));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
    status ? getTasksbyStatus() : getTasks();
  }, [token, page, pageItemsCount, dispatch, status]);
  function onDelete(): void {
    console.log("deleted");
  }
  function onUpdate(): void {
    console.log("updated");
  }
  return (
    <div>
      <Header />
      <div className={styles.main}>
        <div>
          <button className={styles.createBask} onClick={openModal}>
            Create Task
          </button>
        </div>
        <div className={styles.changeStatusBtns}>
          <button className={styles.taskstatus} onClick={() => setStatus("todo")}>
            todo
          </button>
          <button className={styles.taskstatus} onClick={() => setStatus("in progress")}>
            in progress
          </button>
          <button className={styles.taskstatus} onClick={() => setStatus("done")}>
            done
          </button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Create Task Modal">
        <h2>Create a New Task</h2>
        <form>
          <div>
            <label htmlFor="title">Title:</label>
            <input type="text" id="title" name="title" value={newTask.title} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div>
            <label htmlFor="endDate">End Date and Time:</label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={newTask.endDate}
              onChange={handleInputChange}
            />
          </div>
          <button type="button" onClick={createTask}>
            Create Task
          </button>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
        </form>
      </Modal>
      <div className="tasks">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={onDelete} onUpdate={onUpdate} />
        ))}
      </div>
      <button onClick={() => setPage(page - 1)}>prev</button>
      {page}
      <button onClick={() => setPage(page + 1)}>next</button>
    </div>
  );
};

export default UserPage;
