import React from "react";
import styles from "../../css/taskcard.module.css";

interface TaskDeleteModalProps {
  onClose: () => void;
  onConfirmDelete: () => void;
}

const TaskDeleteModal: React.FC<TaskDeleteModalProps> = ({ onClose, onConfirmDelete }) => {
  return (
    <div>
      <button className={styles.modal_btn_close} onClick={onClose}>
        X
      </button>
      <div className={styles.delete_modal_body}>
        <h2 className={styles.modal_title}>Confirm Delete</h2>
        <button className={styles.modal_btn} onClick={onConfirmDelete}>
          Confirm Delete
        </button>
      </div>
    </div>
  );
};

export default TaskDeleteModal;
