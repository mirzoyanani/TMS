import React, { useState } from "react";
import styles from "../css/register.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HOST_NAME } from "../lib";
const Register: React.FC = () => {
  const naviagte = useNavigate();
  const [errorMsg, setErrorMsg] = useState("Էլեկտրոնային փոստը արդեն օգտագործվել է");
  const [error, setError] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // console.log("Form Datas:", formData);
    setLoading(true);

    try {
      const response = await axios.post(`${HOST_NAME}/auth/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data) {
        naviagte("/");
        console.log(response.data, 55555);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMsg(error.response.data.meta.error.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.register_container}>
        <h2 className={styles.title}> T M S Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.groups}>
            <div className={styles.form_group}>
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className={styles.form_group}>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="surame"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className={styles.groups}>
            <div className={styles.form_group}>
              <label htmlFor="telephone">Telephone</label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                pattern=" /^\+374 \d{6}$/"
                value={formData.telephone}
                onChange={handleInputChange}
                required
                placeholder="+374 ******"
              />
            </div>
            <div className={styles.form_group}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className={styles.groups}>
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
            <div className={`${styles.form_group} ${styles.imageInput}`}>
              <label htmlFor="profileImage">Upload Profile Image</label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>
          </div>
          {error && <div style={{ margin: "22px", color: "red" }}>{errorMsg}</div>}
          {loading ? <button type="submit">Loading...</button> : <button type="submit">Register</button>}
        </form>
      </div>
    </div>
  );
};

export default Register;
