import Header from "../components/Header";
import styles from "../css/generalPage.module.css";
import { HOST_NAME } from "../lib";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setTasks } from "../redux/reducers/tasksSlice";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/persistReducer";
import TaskCard from "../components/TaskCard";
import Modal from "react-modal";
import Footer from "../components/Footer";
import format from "date-fns/format";
Modal.setAppElement("#root");

const UserPage = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [itemsCount, setItemsCount] = useState(undefined);
  const pageItemsCount = 12;
  const tasks = useSelector((state: RootState) => state.task.tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    endDate: "",
  });

  const openModal = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  const createTask = async (): Promise<void> => {
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
      getTasks();
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    closeModal();
  };

  const handleSearch = async (searchValue: string) => {
    try {
      const response = await axios.get(
        `${HOST_NAME}/task/search?title=${searchValue}&page=${page}&pageSize=${pageItemsCount}`,
        {
          headers: { token },
        },
      );
      // console.log("search tasker");
      setItemsCount(response.data.data.pagination.totalPages);

      dispatch(setTasks(response.data.data.items));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };
  async function getTasks() {
    console.log("Fetching tasks...");
    try {
      const response = await axios.get(`${HOST_NAME}/task?page=${page}&pageSize=${pageItemsCount}`, {
        headers: { token },
      });
      dispatch(setTasks(response.data.data.items));
      setItemsCount(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }
  const updateTaskStatus = async (taskId: number, status: string) => {
    try {
      await axios.put(
        `${HOST_NAME}/task/status`,
        { id: taskId, status: status },
        {
          headers: { token },
        },
      );
      getTasks();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  useEffect(() => {
    async function getTasksbyStatus() {
      try {
        const response = await axios.get(
          `${HOST_NAME}/task/status?page=${page}&pageSize=${pageItemsCount}&status=${status}`,
          {
            headers: { token },
          },
        );
        setItemsCount(response.data.data.pagination.totalPages);
        dispatch(setTasks(response.data.data.items));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
    if (searchValue) {
      handleSearch(searchValue);
    } else if (status) {
      getTasksbyStatus();
    } else {
      getTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page, status, searchValue]);

  async function onDelete(taskId: number): Promise<void> {
    console.log("deleted");
    console.log(taskId);
    try {
      await axios.delete(`${HOST_NAME}/task/${taskId}`, {
        headers: { token },
      });
      getTasks();
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  const handlePageChange = (newPage: number) => {
    if (itemsCount && newPage > 0 && newPage <= itemsCount) {
      setPage(newPage);
    }
  };

  return (
    <div className={styles.main_div}>
      <Header onSearch={handleSearch} setSearchValue={setSearchValue} />
      <div className={styles.middle_part}>
        {!searchValue && (
          <div className={styles.main}>
            <div>
              <button className={styles.createBask} onClick={openModal}>
                Create Task
              </button>
            </div>
            <div className={styles.changeStatusBtns}>
              <button
                className={styles.taskstatus}
                onClick={() => {
                  setStatus("todo");
                  setPage(1);
                }}
              >
                todo
              </button>
              <button
                className={styles.taskstatus}
                onClick={() => {
                  setStatus("in progress");
                  setPage(1);
                }}
              >
                in progress
              </button>
              <button
                className={styles.taskstatus}
                onClick={() => {
                  setStatus("done");
                  setPage(1);
                }}
              >
                done
              </button>
            </div>
          </div>
        )}
        <Modal
          className={styles.modal}
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Create Task Modal"
        >
          <h2 className={styles.modal_title}>Create a New Task</h2>
          <button className={styles.modal_btn_close} type="button" onClick={closeModal}>
            X
          </button>
          <form className={styles.modal_form}>
            <div>
              <label htmlFor="title">Title:</label>
              <input type="text" id="title" name="title" onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="description">Description:</label>
              <textarea
                maxLength={100}
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
              />
            </div>
            <div className={styles.btns}>
              <button className={styles.modal_btn} type="button" onClick={createTask}>
                Create Task
              </button>
            </div>
          </form>
        </Modal>
        <div className={styles.tasks}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              updateTaskStatus={updateTaskStatus}
              getTasks={getTasks}
            />
          ))}
        </div>

        {tasks.length > 0 && (
          <div className={styles.setPage_btns}>
            <button onClick={() => handlePageChange(page - 1)}>previous</button>
            <span className={styles.page_num}>{page}</span>
            <button onClick={() => handlePageChange(page + 1)}>next</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default UserPage;
