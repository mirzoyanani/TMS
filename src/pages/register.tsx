import React, { useState } from "react";
import styles from "../css/register.module.css";
import { useNavigate } from "react-router-dom";
const Register: React.FC = () => {
  const naviagte = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    telephone: "",
    email: "",
    password: "",
    profileImage: null as File | null,
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
      profileImage: imageFile,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    console.log("Form Data:", formData);
  };

  return (
    <div className={styles.main}>
      <div className={styles.register_container}>
        <h2 className={styles.title}> T M S Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.groups}>
            <div className={styles.form_group}>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.form_group}>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
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
                value={formData.telephone}
                onChange={handleInputChange}
                required
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
          <button type="submit" onClick={() => naviagte("/")}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
