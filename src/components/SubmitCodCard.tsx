import styles from "../css/getPassword.module.css";
import { useNavigate } from "react-router-dom";
import { HOST_NAME } from "../lib";
import { useState } from "react";
import axios from "axios";
type Props = {
  title: string;
  text: string;
  placeholder: string;
  btn: string;
};

const CodCard = (props: Props) => {
  const [error, setError] = useState("");
  const [cod, setCod] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  async function switchPage(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (cod) {
      try {
        const response = await axios({
          url: `${HOST_NAME}/auth/submitCode`,
          method: "POST",
          data: {
            code: cod,
          },
          headers: {
            token,
          },
          responseType: "json",
        });
        if (response.data) {
          localStorage.setItem("token", response.data.data.token);
          navigate("/newPassword");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.response.data.meta.error.message);
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
          onChange={(e) => {
            setCod(e.target.value);
          }}
          type="text"
          name=""
          id=""
          placeholder={props.placeholder}
        />
        {error && <div style={{ margin: "22px", color: "red" }}>{error}</div>}
        <div className={styles.buttons}>
          <button className={styles.btn2}>{props.btn}</button>
        </div>
      </form>
    </div>
  );
};

export default CodCard;
