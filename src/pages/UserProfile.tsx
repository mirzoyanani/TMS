import React, { FormEvent, useEffect, useState } from "react";
import Modal from "react-modal";

import styles from "../css/userProfile.module.css";
import axios from "axios";
import { HOST_NAME } from "../lib";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
interface Userdata {
  name: string;
  surname: string;
  email: string;
  telephone: string;
}
const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userData, setUserData] = useState<Userdata>();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [telephone, setTelephone] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const token = localStorage.getItem("token");
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
      setUserData(userData);
      setName(userData.name);
      setSurname(userData.surname);
      setEmail(userData.email);
      setImage(userData.image);
      setTelephone(userData.telephone);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      (selectedImage && userData) ||
      (userData && userData.name != name) ||
      (userData && userData.surname != surname) ||
      (userData && userData.email != email) ||
      (userData && userData.telephone != telephone)
    ) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("surname", surname);
      formData.append("telephone", telephone);
      if (selectedImage) {
        formData.append("profilePicture", selectedImage);
      } else {
        formData.append("profilePicture", image);
      }

      try {
        await axios({
          url: `${HOST_NAME}/user`,
          method: "PUT",
          headers: {
            token: token,
          },
          data: formData,
        });
        getUserData();
        setModalIsOpen(false);
      } catch (error) {
        console.error(error);
      }
    }
    setModalIsOpen(false);
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
            <label className={styles.label}>Telephone:</label>
            <input
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className={styles.input}
              required
              type="text"
              pattern="^\+374 \d{8}$"
              placeholder="+374 12345678"
            />
          </div>

          <button className={styles.updateButton}>Update</button>
        </form>
      </Modal>
      <Footer />
    </div>
  );
};

export default UserProfile;
