import React, { useState, ChangeEvent } from "react";
import styles from "../css/taskcard.module.css";
import Modal from "react-modal";
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
  onUpdate: (updatedTask: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleEdit = () => {
    setModalOpen(true);
  };

  const handleSave = () => {
    console.log("update task");
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
  };

  return (
    <div className={styles.task_card}>
      <h3>{task.title}</h3>
      <p>Description: {task.description}</p>
      <p>Status: {task.status}</p>
      <p>Creation Date: {task.creation_date}</p>
      <p>End Date: {task.end_date}</p>

      <div>
        <button onClick={handleEdit}>Edit</button>
        <button onClick={() => onDelete(task.id)}>Delete</button>
      </div>

      <Modal
        className={styles.react_modal}
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Edit Task Modal"
      >
        <h2>Edit Task</h2>
        <div className="updateModal">
          <input type="text" name="title" value={task.title} onChange={handleChange} />
          <textarea name="description" value={task.description} onChange={handleChange} />
          <select name="status" value={task.status} onChange={handleChange}>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default TaskCard;
