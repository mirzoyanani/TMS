import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import styles from "../css/userProfile.module.css";
import axios from "axios";
import { HOST_NAME } from "../lib";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import ProfileUpdate from "../components/modals/ProfileUpdate";
export interface UserdataT {
  name: string;
  surname: string;
  email: string;
  telephone: string;
  image?: string;
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<null | UserdataT>(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async () => {
      setUserData(await getUserData(token!));
      setLoading(false);
    })();
  }, [token]);

  const modalToggle = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, imageFile: File | null) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    formData.append("profilePicture", imageFile ?? userData!.image!);

    try {
      await axios({
        url: `${HOST_NAME}/user`,
        method: "PUT",
        headers: {
          token: token,
        },
        data: formData,
      });
      const data = await getUserData(token!);
      setUserData(data);
      setModalIsOpen(false);
    } catch (error) {
      console.error(error);
    }

    setModalIsOpen(false);
  };

  return (
    <div className={styles.main}>
      {loading && (
        <div
          style={{
            position: "absolute",
            zIndex: 999,
            backgroundColor: "white",
            height: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px",
          }}
        >
          LOADING.....
        </div>
      )}
      <div className={styles.header} onClick={() => navigate("/general")}>
        T M S
      </div>

      <div className={styles.body}>
        <div className={styles.main_modal}>
          <div className={styles.image_part}>
            <img style={{ width: "250px", height: "250px" }} src={`${HOST_NAME}/images/${userData?.image}`} alt="" />
            <div className={styles.info}>
              <p className={styles.userInfo}>Name: {userData?.name}</p>
              <p className={styles.userInfo}>Surname: {userData?.surname}</p>
              <p className={styles.userInfo}>Email: {userData?.email}</p>
              <p className={styles.userInfo}>Telephone: {userData?.telephone}</p>
            </div>
          </div>
          <div className={styles.button_part}>
            <button className={styles.updateButton} onClick={modalToggle}>
              Update Info
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={modalToggle}
        contentLabel="Update User Modal"
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
      >
        <ProfileUpdate handleUpdate={handleUpdate} userData={userData} onClose={modalToggle} />
      </Modal>
      <Footer />
    </div>
  );
};

export default UserProfile;

async function getUserData(token: string) {
  const response = await axios({
    url: `${HOST_NAME}/user`,
    method: "GET",
    headers: {
      token: token,
    },
    responseType: "json",
  });

  return response.data.data.items[0];
}
