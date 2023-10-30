import React, { useState, ChangeEvent } from "react";
import Modal from "react-modal";
import styles from "../../css/taskcard.module.css";
import axios from "axios";
import { format } from "date-fns";
import { HOST_NAME } from "../../lib";
interface TaskUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  getTasks: () => void;
}
interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  creation_date: string;
  end_date: string;
}
const TaskUpdateModal: React.FC<TaskUpdateModalProps> = ({ isOpen, onClose, task, getTasks }) => {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const token = localStorage.getItem("token");

  const formatISODateToCustomFormat = (isoDate: string, customFormat: string) => {
    return format(new Date(isoDate), customFormat);
  };

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
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  return (
    <Modal className={styles.react_modal} isOpen={isOpen} onRequestClose={onClose} contentLabel="Edit Task Modal">
      <h2 className={styles.modal_title}>Edit Task</h2>
      <button className={styles.modal_btn_close} onClick={onClose}>
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
            maxLength={20}
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
  );
};

export default TaskUpdateModal;
