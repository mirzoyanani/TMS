import React, { useState } from "react";
import styles from "../css/taskcard.module.css";
import Modal from "react-modal";
import axios from "axios";
import { format } from "date-fns";
import { HOST_NAME } from "../lib";
import Select from "./StatusSelect";
import TaskUpdateModal from "./modals/TaskUpdate";
import TaskDeleteModal from "./modals/DeleteModal";
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
  getTasks: () => void;
  updateTaskStatus: (taskId: number, status: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, updateTaskStatus, getTasks }) => {
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
    setEditedTask(task);
  };

  const handleStatusChange = (newStatus: string) => {
    updateTaskStatus(editedTask.id, newStatus);
  };
  function formatISODateToCustomFormat(isoDate: string, customFormat: string) {
    return format(new Date(isoDate), customFormat);
  }

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

  return (
    <div className={styles.task_card}>
      <h3 className={styles.task_title}>{task.title}</h3>
      <p>Des: {task.description}</p>
      <Select value={task.status} onChange={handleStatusChange} styles={styles} />
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
        <TaskDeleteModal onClose={() => setDeleteModalOpen(false)} onConfirmDelete={handleConfirmDelete} />
      </Modal>
      <Modal
        className={styles.react_modal}
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Edit Task Modal"
      >
        <TaskUpdateModal
          task={editedTask}
          onClose={() => setModalOpen(false)}
          isOpen={isModalOpen}
          getTasks={getTasks}
        />
      </Modal>
    </div>
  );
};
