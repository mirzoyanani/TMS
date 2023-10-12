import React, { useState } from "react";
import styles from "../css/getPassword.module.css";
import { useNavigate } from "react-router-dom";
import { HOST_NAME } from "../lib";
import axios from "axios";

type Props = {
  title: string;
  text: string;
  placeholder: string;
  btn: string;
};

const EmailCard = (props: Props) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function switchPage(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (email) {
      try {
        setLoading(true);

        const response = await axios({
          url: `${HOST_NAME}/auth/forgetPassword`,
          method: "POST",
          data: {
            email: email,
          },
          responseType: "json",
        });

        if (response.data) {
          localStorage.setItem("token", response.data.data.token);
          navigate("/submitCod");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.response.data.meta.error.message);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>{props.title}</h1>
      <h3 className={styles.text}>{props.text}</h3>
      <form onSubmit={switchPage}>
        <input
          className={styles.emailInput}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name=""
          id=""
          placeholder={props.placeholder}
        />
        {error && <div style={{ margin: "22px", color: "red" }}>{error}</div>}
        <div className={styles.buttons}>
          <button className={styles.btn2} disabled={loading}>
            {loading ? "Loading..." : props.btn}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailCard;
