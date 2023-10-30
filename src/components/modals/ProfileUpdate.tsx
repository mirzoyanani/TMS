import React, { useState } from "react";
import styles from "../../css/userProfile.module.css";
import { HOST_NAME } from "../../lib";
import { UserdataT } from "../../pages/UserProfile";

interface Props {
  handleUpdate: (e: React.FormEvent<HTMLFormElement>, imageFile: File | null) => void;
  userData: UserdataT | null;
  onClose: () => void;
}
function ProfileUpdate({ handleUpdate, userData, onClose }: Props) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const newImageUrl = URL.createObjectURL(file);
      setImageUrl(newImageUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleUpdate(e, imageFile);
  };

  return (
    <div className={styles.taskCreationModal}>
      <button className={styles.modal_btn_close} type="button" onClick={onClose}>
        X
      </button>
      <h2 className={styles.modalTitle}>Update User Information</h2>
      <div className={styles.image_div}>
        <label className={styles.label}>Image:</label>

        <img
          style={{ width: "100px", height: "100px" }}
          src={imageUrl ? imageUrl : `${HOST_NAME}/images/${userData?.image}`}
          alt="Preview"
          className={styles.previewImage}
        />

        <input type="file" accept="image/*" onChange={handleImageChange} className={styles.file_input} />
      </div>
      <form className={styles.form_info} onSubmit={handleSubmit}>
        <div>
          <label className={styles.label}>Name:</label>
          <input type="text" name="name" defaultValue={userData?.name} className={styles.input} required />
        </div>
        <div>
          <label className={styles.label}>Surname:</label>
          <input type="text" name="surname" defaultValue={userData?.surname} className={styles.input} required />
        </div>
        <div>
          <label className={styles.label}>Telephone:</label>
          <input
            type="tel"
            name="telephone"
            defaultValue={userData?.telephone}
            className={styles.input}
            required
            pattern="^\+374\d{8}$"
            placeholder="+374 12345678"
          />
        </div>
        <button className={styles.updateButton}>Update</button>
      </form>
    </div>
  );
}

export default ProfileUpdate;
