import React, { useState, ChangeEvent } from "react";
import styles from "../css/taskcard.module.css";
import Modal from "react-modal";
import axios from "axios";
import { format } from "date-fns";
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
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "dd/MM/yyyy HH:mm:ss");
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>({ ...task });

  const handleEdit = () => {
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const taskToUpdate = {
        ...editedTask,
      };

      const response = await axios.put(`/api/tasks/${editedTask.id}`, taskToUpdate);

      console.log("Task updated:", response.data);

      setModalOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    try {
      axios.put(`/api/tasks/${editedTask.id}`, { status: value });
    } catch (error) {
      console.error("Error updating status:", error);
    }
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
      <h3>{editedTask.title}</h3>
      <p>Description: {editedTask.description}</p>
      <select
        className={styles.status_select}
        style={{ backgroundColor: getStatusColor(editedTask.status) }}
        name="status"
        value={editedTask.status}
        onChange={handleStatusChange}
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
        <h2>Edit Task</h2>
        <div className="updateModal">
          <input type="text" name="title" value={editedTask.title} onChange={handleChange} maxLength={35} />
          <textarea name="description" value={editedTask.description} onChange={handleChange} />
          <input type="datetime-local" name="end_date" value={editedTask.end_date} onChange={handleChange} />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setModalOpen(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default TaskCard;
