import React, { useState } from "react";
import styles from "../css/login.module.css";
import Logo from "../components/logo";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <div className={styles.main_div}>
      <Logo />

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
