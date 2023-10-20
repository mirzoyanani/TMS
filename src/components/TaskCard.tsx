import React, { useState, ChangeEvent } from "react";
import styles from "../css/taskcard.module.css";
import Modal from "react-modal";
import axios from "axios";
import { format } from "date-fns";
import { HOST_NAME } from "../lib";
Modal.setAppElement("#root");

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  creation_date: string;
  end_date: string;
}

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: number) => void;
  getTasks: () => void;
  updateTaskStatus: (taskId: number, status: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, updateTaskStatus, getTasks }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);
  const token = localStorage.getItem("token");

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(editedTask.id);
    setDeleteModalOpen(false);
  };

  const handleEdit = () => {
    setModalOpen(true);
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;

    if (newStatus !== editedTask.status) {
      updateTaskStatus(editedTask.id, newStatus);
    }
  };
  function formatISODateToCustomFormat(isoDate: string, customFormat: string) {
    return format(new Date(isoDate), customFormat);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const taskToUpdate = {
        title: editedTask.title,
        description: editedTask.description,
        end_date: formatISODateToCustomFormat(editedTask.end_date, "yyyy-MM-dd HH:mm:ss"),
        id: editedTask.id,
      };

      await axios.put(`${HOST_NAME}/task`, taskToUpdate, {
        headers: {
          token: token,
        },
      });
      getTasks();
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "rgba(0, 255, 0, 0.19)";
      case "in progress":
        return "rgba(255, 208, 0, 0.35)";
      case "todo":
        return "rgba(255, 0, 0, 0.1)";
      default:
        return "black";
    }
  };

  return (
    <div className={styles.task_card}>
      <h3 className={styles.task_title}>{editedTask.title}</h3>
      <p>Des: {editedTask.description}</p>
      <select
        className={styles.status_select}
        style={{ backgroundColor: getStatusColor(task.status) }}
        name="status"
        value={task.status}
        onChange={(e) => handleStatusChange(e)}
      >
        <option value="todo">Todo</option>
        <option value="in progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <p>Creation Date: {formatISODateToCustomFormat(task.creation_date, "dd/MM/yyyy HH:mm:ss")}</p>
      <p>End Date: {formatISODateToCustomFormat(task.end_date, "dd/MM/yyyy HH:mm:ss")}</p>
      <div className={styles.edit_del_btns}>
        <button className={styles.btn} onClick={handleEdit}>
          Edit
        </button>
        <button className={styles.btn} onClick={handleDelete}>
          Delete
        </button>
      </div>
      <Modal
        className={styles.delete_modal}
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setDeleteModalOpen(false)}
        contentLabel="Delete Confirmation Modal"
      >
        <button className={styles.modal_btn_close} onClick={() => setDeleteModalOpen(false)}>
          X
        </button>
        <div className={styles.delete_modal_body}>
          <h2 className={styles.modal_title}>Confirm Delete</h2>
          <button className={styles.modal_btn} onClick={handleConfirmDelete}>
            Confirm Delete
          </button>
        </div>
      </Modal>
      <Modal
        className={styles.react_modal}
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Edit Task Modal"
      >
        <h2 className={styles.modal_title}> Edit Task</h2>
        <button className={styles.modal_btn_close} onClick={() => setModalOpen(false)}>
          X
        </button>
        <form onSubmit={handleSave} className={styles.modal_form}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              required
              type="text"
              name="title"
              value={editedTask.title}
              className={styles.newTaskTitle}
              onChange={handleChange}
              maxLength={32}
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              required
              className={styles.discription_area}
              name="description"
              value={editedTask.description}
              onChange={handleChange}
              maxLength={36}
            />
          </div>
          <div>
            <label htmlFor="endDate">End Date and Time:</label>
            <input
              required
              type="datetime-local"
              name="end_date"
              value={formatISODateToCustomFormat(editedTask.end_date, "yyyy-MM-dd'T'HH:mm")}
              onChange={handleChange}
              className={styles.task_date}
            />
          </div>
          <div className={styles.btns}>
            <button className={styles.modal_btn}>Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TaskCard;
