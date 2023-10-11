import React, { useEffect, useState } from "react";
import Modal from "react-modal";

import styles from "../css/userProfile.module.css";
import axios from "axios";
import { HOST_NAME } from "../lib";
import { useNavigate } from "react-router-dom";

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [telephone, setTelephone] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function getUserData() {
      try {
        const response = await axios({
          url: `${HOST_NAME}/user`,
          method: "GET",
          headers: {
            token: token,
          },
          responseType: "json",
        });
        const userData = response.data.data.data[0];
        console.log(userData);

        setName(userData.name);
        setSurname(userData.surname);
        setEmail(userData.email);
        setImage(userData.image);
        setTelephone(userData.telephone);
      } catch (error) {
        console.error(error);
      }
    }
    getUserData();
  }, [token]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);

      // Create a URL for the selected image and set it as a preview
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const handleUpdate = async () => {
    // closeModal();

    if (selectedImage) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("surname", surname);
      formData.append("email", email);
      formData.append("telephone", telephone);
      formData.append("image", selectedImage);

      try {
        await axios({
          url: `${HOST_NAME}/updateUser`,
          method: "POST",
          headers: {
            token: token,
          },
          data: formData,
        });
        // Handle success
      } catch (error) {
        console.error(error);
        // Handle error
      }
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.header} onClick={() => navigate("/general")}>
        {" "}
        T M S{" "}
      </div>
      <div className={styles.body}>
        <div className={styles.main_modal}>
          <div className={styles.image_part}>
            <img style={{ width: "250px", height: "250px" }} src={`${HOST_NAME}/images/${image}`} alt="" />
            <div className={styles.info}>
              <p className={styles.userInfo}>Name: {name}</p>
              <p className={styles.userInfo}>Surname: {surname}</p>
              <p className={styles.userInfo}>Email: {email}</p>
              <p className={styles.userInfo}>Telephone: {telephone}</p>
            </div>
          </div>
          <div className={styles.button_part}>
            <button className={styles.updateButton} onClick={openModal}>
              Update Info
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Update User Modal"
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
      >
        <h2 className={styles.modalTitle}>Update User Information</h2>
        <div className={styles.image_div}>
          <label className={styles.label}>Image:</label>
          {previewImage && (
            <img
              style={{ width: "100px", height: "100px" }}
              src={previewImage}
              alt="Preview"
              className={styles.previewImage}
            />
          )}
          {!previewImage && (
            <img
              style={{ width: "100px", height: "100px" }}
              src={`${HOST_NAME}/images/${image}`}
              alt="Preview"
              className={styles.previewImage}
            />
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} className={styles.file_input} />
        </div>
        <form onSubmit={handleUpdate}>
          <div>
            <label className={styles.label}>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div>
            <label className={styles.label}>Surname:</label>
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div>
            <label className={styles.label}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div>
            <label className={styles.label}>Telephone:</label>
            <input
              type="text"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <button className={styles.updateButton}>Update</button>
          {/* <button className={styles.cancelButton} onClick={closeModal}>
            Cancel
          </button> */}
        </form>
      </Modal>
    </div>
  );
};

export default UserProfile;
