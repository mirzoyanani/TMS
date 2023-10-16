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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "dd/MM/yyyy HH:mm:ss");
};
function formatISODateToCustomFormat(isoDate: string, customFormat: string) {
  return format(new Date(isoDate), customFormat);
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, updateTaskStatus, getTasks }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>({ ...task });
  const token = localStorage.getItem("token");
  const handleEdit = () => {
    setModalOpen(true);
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;

    if (newStatus !== editedTask.status) {
      updateTaskStatus(editedTask.id, newStatus);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const taskToUpdate = {
        title: editedTask.title,
        description: editedTask.description,
        end_date: new Date(editedTask.end_date).toISOString().slice(0, 19).replace("T", " "),
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
      <p>Description: {editedTask.description}</p>
      <select
        className={styles.status_select}
        style={{ backgroundColor: getStatusColor(editedTask.status) }}
        name="status"
        value={editedTask.status}
        onChange={(e) => handleStatusChange(e)}
      >
        <option value="todo">Todo</option>
        <option value="in progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <p>Creation Date: {formatDate(task.creation_date)}</p>
      <p>End Date: {formatDate(editedTask.end_date)}</p>
      <div>
        <button className={styles.btn} onClick={handleEdit}>
          Edit
        </button>
        <button className={styles.btn} onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
      <Modal
        className={styles.react_modal}
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Edit Task Modal"
      >
        <h2> Edit Task</h2>
        <button className={styles.modal_btn_close} onClick={() => setModalOpen(false)}>
          X
        </button>
        <form onSubmit={handleSave} className={styles.modal_form}>
          <div>
            <input required type="text" name="title" value={editedTask.title} onChange={handleChange} maxLength={35} />
          </div>
          <div>
            <textarea
              required
              className={styles.discription_area}
              name="description"
              value={editedTask.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              required
              type="datetime-local"
              name="end_date"
              value={formatISODateToCustomFormat(editedTask.end_date, "yyyy-MM-dd'T'HH:mm")}
              onChange={handleChange}
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
