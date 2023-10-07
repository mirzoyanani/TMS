import React, { useState } from "react";
import styles from "../css/login.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HOST_NAME } from "../lib";
const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await axios({
        url: `${HOST_NAME}/auth/login`,
        method: "POST",
        data: {
          email: username,
          password,
        },
        responseType: "json",
      });

      if (response.data) {
        localStorage.setItem("token", response.data.data.token);
        navigate("/general");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.response.data.meta.error.message);
    }
  };

  return (
    <div className={styles.main_div}>
      <div className={styles.logo}>
        <div className={styles.logo_items}>
          <h1 className={styles.tword}>T</h1>
          <h1 className={styles.word_items}>ask</h1>
        </div>

        <div className={styles.logo_items}>
          <h1 className={styles.mword}>M</h1>
          <h1 className={styles.word_items}>anagement</h1>
        </div>
        <div>
          <div className={styles.logo_items}>
            <h1 className={styles.sword}>S</h1>
            <h1 className={styles.word_items}>ystem</h1>
          </div>
        </div>
      </div>

      <div className={styles.login_container}>
        <h2 className={styles.login_title}>
          Login to <p style={{ display: "inline", color: "blue" }}>T M S</p>{" "}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label htmlFor="username">Username</label>
            <input
              type="email"
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          {error && <div style={{ margin: "22px", color: "red" }}>{error}</div>}
          <button type="submit">Login</button>
        </form>
        <div className={styles.additional_options}>
          <div className={styles.goForgetPasswordPage}>
            <p
              onClick={() => {
                navigate("/forgetPassword");
              }}
            >
              Forgot Password?
            </p>
          </div>
          <div className={styles.goRegisterPage}>
            Don't have an account?{" "}
            <p
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
