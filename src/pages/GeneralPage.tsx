import Header from "../components/Header";
import styles from "../css/generalPage.module.css";
import { HOST_NAME } from "../lib";
import { FormEvent, useEffect, useState } from "react";
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

const GeneralPage = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [itemsCount, setItemsCount] = useState(undefined);
  const pageItemsCount = 12;
  const tasks = useSelector((state: RootState) => state.task.tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [orderBy, setOrderBy] = useState("DESC");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    endDate: "",
  });

  const ModalToggle = (): void => {
    setIsModalOpen(!isModalOpen);
  };

  const createTask = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const dateObject = new Date(newTask.endDate);
    const formattedTimestamp = format(dateObject, "yyyy-MM-dd HH:mm:ss");
    console.log(newTask.title, newTask.description, formattedTimestamp);

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
        await getTasksbyStatus();
      } else {
        await getTasks();
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    ModalToggle();
  };

  const handleSearch = async (searchValue: string): Promise<void> => {
    setStatus("");
    try {
      const response = await axios.get(
        `${HOST_NAME}/task?query=${searchValue}&page=${page}&pageSize=${pageItemsCount}`,
        {
          headers: { token },
        },
      );
      setItemsCount(response.data.data.pagination.totalPages);
      dispatch(setTasks(response.data.data.items));
    } catch (error) {
      throw new Error(`Error searching tasks :${error}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };
  async function getTasks(): Promise<void> {
    try {
      const response = await axios.get(`${HOST_NAME}/task?page=${page}&pageSize=${pageItemsCount}`, {
        headers: { token },
      });
      dispatch(setTasks(response.data.data.items));
      setItemsCount(response.data.data.pagination.totalPages);
    } catch (error) {
      throw new Error(`Error fetching tasks:${error}`);
    }
  }
  const updateTaskStatus = async (taskId: number, taskStatus: string): Promise<void> => {
    try {
      await axios.put(
        `${HOST_NAME}/task/status`,
        { id: taskId, status: taskStatus },
        {
          headers: { token },
        },
      );

      if (searchValue) {
        handleSearch(searchValue);
      } else if (status) {
        getTasksbyStatus();
      } else {
        getTasks();
      }
    } catch (error) {
      throw new Error(`Error updating status:${error}`);
    }
  };
  async function getTasksbyStatus(): Promise<void> {
    try {
      const response = await axios.get(`${HOST_NAME}/task?page=${page}&pageSize=${pageItemsCount}&status=${status}`, {
        headers: { token },
      });
      setItemsCount(response.data.data.pagination.totalPages);
      dispatch(setTasks(response.data.data.items));
    } catch (error) {
      throw new Error(`Error fetching tasks:${error}`);
    }
  }
  useEffect(() => {
    if (searchValue) {
      if (orderBy == "ASC") {
        const path = getOrderTasksPath("search", "ASC");
        orderByDate(path);
      } else {
        handleSearch(searchValue);
      }
    } else if (status) {
      if (orderBy == "ASC") {
        const path = getOrderTasksPath("status", "ASC");
        orderByDate(path);
      } else {
        getTasksbyStatus();
      }
    } else {
      if (orderBy == "ASC") {
        const path = getOrderTasksPath("all", "ASC");
        orderByDate(path);
      } else {
        getTasks();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page, status, searchValue]);
  async function onDelete(taskId: number): Promise<void> {
    try {
      await axios.delete(`${HOST_NAME}/task/${taskId}`, {
        headers: { token },
      });
      getTasks();
    } catch (error) {
      throw new Error("Error deleting tasks ");
    }
  }

  const handlePageChange = (newPage: number): void => {
    if (itemsCount && newPage > 0 && newPage <= itemsCount) {
      setPage(newPage);
    }
  };

  const orderByDate = async (path: string): Promise<void> => {
    try {
      const rsp = await axios.get(path, {
        headers: { token },
      });
      dispatch(setTasks(rsp.data.data.items));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const getOrderTasksPath = (type: string, newOrderBy: string): string => {
    const mainPath = `${HOST_NAME}/task?page=${page}&pageSize=${pageItemsCount}&date=${newOrderBy}`;
    if (type && type == "search") {
      return mainPath + `&query=${searchValue}`;
    } else if (type && type == "status") {
      return mainPath + `&status=${status}`;
    } else if (type && type == "all") {
      return mainPath;
    }
    return "";
  };
  const toggleSortingOrder = async (): Promise<void> => {
    const newOrderBy = orderBy === "DESC" ? "ASC" : "DESC";
    setOrderBy(newOrderBy);
    if (searchValue) {
      const path = getOrderTasksPath("search", newOrderBy);
      await orderByDate(path);
    } else if (status) {
      const path = getOrderTasksPath("status", newOrderBy);
      await orderByDate(path);
    } else {
      const path = getOrderTasksPath("all", newOrderBy);
      await orderByDate(path);
    }
  };

  return (
    <div className={styles.main_div}>
      <Header onSearch={handleSearch} setSearchValue={setSearchValue} />
      <div className={styles.middle_part}>
        {!searchValue && (
          <div className={styles.main}>
            <div>
              <button className={styles.createBask} onClick={ModalToggle}>
                Create Task
              </button>
            </div>
            <div className={styles.changeStatusBtns}>
              <button
                style={{ backgroundColor: status === "todo" ? "#91abdb" : "beige" }}
                className={styles.taskstatus}
                onClick={() => {
                  setStatus("todo");
                  setPage(1);
                }}
              >
                todo
              </button>
              <button
                style={{ backgroundColor: status === "in progress" ? "#91abdb" : "beige" }}
                className={styles.taskstatus}
                onClick={() => {
                  setStatus("in progress");
                  setPage(1);
                }}
              >
                in progress
              </button>
              <button
                style={{ backgroundColor: status === "done" ? "#91abdb" : "beige" }}
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
        {tasks.length && (
          <button className={styles.sortingButton} onClick={toggleSortingOrder}>
            Sorting Order - {orderBy === "ASC" ? "Ascending" : "Descending"}
          </button>
        )}
        <Modal
          className={styles.modal}
          isOpen={isModalOpen}
          onRequestClose={ModalToggle}
          contentLabel="Create Task Modal"
        >
          <h2 className={styles.modal_title}>Create a New Task</h2>
          <button className={styles.modal_btn_close} type="button" onClick={ModalToggle}>
            X
          </button>
          <form onSubmit={createTask} className={styles.modal_form}>
            <div>
              <label htmlFor="title">Title:</label>
              <input type="text" maxLength={32} id="title" name="title" onChange={handleInputChange} required />
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
        </Modal>
        {tasks.length ? (
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
        ) : (
          <div className={styles.noTasks}>Create your Tasks</div>
        )}
        {tasks.length && (
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

export default GeneralPage;
