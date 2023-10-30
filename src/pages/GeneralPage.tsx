import styles from "../css/generalPage.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../redux/reducers/tasksSlice.ts";
import { RootState } from "../redux/reducers/persistReducer.tsx";
import { TaskCard } from "../components/TaskCard.tsx";
import Modal from "react-modal";
import Footer from "../components/Footer.tsx";
import TaskCreate from "../components/modals/TaskCreate.tsx";
import Button from "../components/StatusButton.tsx";
import Select from "../components/StatusSelect.tsx";
import Header from "../components/Header.tsx";
import {
  get_tasks,
  get_ordered_tasks_path,
  get_tasks_by_search,
  update_task_status,
  fetch_tasks_by_status,
  get_tasks_order_by_date,
  statuses,
} from "../lib";
Modal.setAppElement("#root");

const GeneralPage = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [itemsCount, setItemsCount] = useState(undefined);
  const tasks = useSelector((state: RootState) => state.task.tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [orderBy, setOrderBy] = useState("DESC");

  const ModalToggle = (): void => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSearch = async (searchValue: string): Promise<void> => {
    setStatus("");
    try {
      const { items, totalPages } = await get_tasks_by_search(searchValue, page, token);
      setItemsCount(totalPages);
      dispatch(setTasks(items));
    } catch (error) {
      throw new Error(`Error searching tasks :${error}`);
    }
  };

  async function getTasks() {
    try {
      const { items, totalPages } = await get_tasks(page, token);
      dispatch(setTasks(items));
      setItemsCount(totalPages);
    } catch (error) {
      throw new Error(`Error fetching tasks: ${error}`);
    }
  }

  const updateTaskStatus = async (taskId: number, taskStatus: string): Promise<void> => {
    try {
      await update_task_status(taskId, taskStatus, token);
      searchValue ? handleSearch(searchValue) : status ? getTasksbyStatus() : getTasks();
    } catch (error) {
      throw new Error(`Error updating status:${error}`);
    }
  };

  async function getTasksbyStatus(): Promise<void> {
    try {
      const { items, totalPages } = await fetch_tasks_by_status(page, status, token);
      setItemsCount(totalPages);
      dispatch(setTasks(items));
    } catch (error) {
      throw new Error(`Error fetching tasks:${error}`);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      const context = searchValue ? "search" : status ? "status" : "all";
      const orderByValue = orderBy === "ASC" ? "ASC" : "DESC";

      const path = get_ordered_tasks_path(context, orderByValue, page, searchValue, status);

      try {
        const { items, totalPages } = await get_tasks_order_by_date(path, token);
        setItemsCount(totalPages);
        dispatch(setTasks(items));
      } catch (error) {
        throw new Error(`Error fetching tasks: ${error}`);
      }
    };

    fetchData();
  }, [token, page, status, searchValue, orderBy, dispatch]);

  const handlePageChange = (newPage: number): void => {
    if (itemsCount && newPage > 0 && newPage <= itemsCount) {
      setPage(newPage);
    }
  };

  const toggleSortingOrder = async (): Promise<void> => {
    const newOrderBy = orderBy === "DESC" ? "ASC" : "DESC";
    setOrderBy(newOrderBy);

    const context = searchValue ? "search" : status ? "status" : "all";
    const path = get_ordered_tasks_path(context, newOrderBy, page, searchValue, status);

    try {
      const { items, totalPages } = await get_tasks_order_by_date(path, token);
      setItemsCount(totalPages);
      dispatch(setTasks(items));
    } catch (error) {
      throw new Error(`Error fetching tasks: ${error}`);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  };

  return (
    <div className={styles.main_div}>
      <Header onSearch={handleSearch} setSearchValue={setSearchValue} />
      <div className={styles.middle_part}>
        {!searchValue && (
          <div className={styles.main}>
            <div>
              <button className={styles.createTask} onClick={ModalToggle}>
                Create Task
              </button>
            </div>
            <div className={styles.changeStatusBtnsSelect}>
              <Select styles={styles} value={status} onChange={handleStatusChange} />
            </div>
            <div className={styles.changeStatusBtns}>
              {statuses.map((item, id) => {
                return (
                  <Button key={id + "statusBtn"} body={item} setStatus={setStatus} setPage={setPage} status={status} />
                );
              })}
            </div>
          </div>
        )}
        {tasks.length > 1 && (
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
          <TaskCreate token={token} getTasksbyStatus={getTasksbyStatus} getTasks={getTasks} onClose={ModalToggle} />
        </Modal>
        {tasks.length > 0 ? (
          <div className={styles.tasks}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} updateTaskStatus={updateTaskStatus} getTasks={getTasks} />
            ))}
          </div>
        ) : (
          <div className={styles.noTasks}>Create your Tasks</div>
        )}
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

export default GeneralPage;
