import React, { useState } from "react";
import styles from "../css/register.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HOST_NAME } from "../lib";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    telephone: "",
    email: "",
    password: "",
    profilePicture: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const imageFile = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      profilePicture: imageFile,
    });
  };

  const selectProfilePicture = () => {
    const fileInput = document.getElementById("profileImageInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("surname", formData.surname);
      formDataToSend.append("telephone", formData.telephone);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("profilePicture", formData.profilePicture as Blob);

      const response = await axios.post(`${HOST_NAME}/auth/register`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        navigate("/");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMsg(error.response.data.meta.error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.register_container}>
        <h2 className={styles.title}>T M S Registration</h2>
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <div className={styles.form_group}>
            <div className={styles.imageInput}>
              <label htmlFor="profileImage">Profile Picture</label>
              <input
                style={{ display: "none" }}
                type="file"
                id="profileImageInput"
                name="profilePicture"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              <img
                src={
                  formData.profilePicture
                    ? URL.createObjectURL(formData.profilePicture)
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlAEj8WYKph5_UH9Sob8cBsmH1LilAriJxXTzNyAxiJP5tQRWYV3Hz-2oj38r7Cnw1hp8&usqp=CAU"
                }
                alt="Profile Picture"
                className={styles.profileImage}
              />
              <button type="button" className={styles.submitButton} onClick={selectProfilePicture}>
                {formData.profilePicture ? "Change Picture" : "Select Picture"}
              </button>
            </div>
          </div>

          <div className={styles.form_group}>
            <label htmlFor="name">First Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>

          <div className={styles.form_group}>
            <label htmlFor="surname">Last Name</label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.form_group}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>

          <div className={styles.form_group}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={8}
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor="telephone">Telephone</label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              required
            />
          </div>

          {errorMsg && <div style={{ margin: "22px", color: "red" }}>{errorMsg}</div>}

          {loading ? (
            <button type="submit" className={styles.submitButton}>
              Loading...
            </button>
          ) : (
            <button type="submit" className={styles.submitButton}>
              Register
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
