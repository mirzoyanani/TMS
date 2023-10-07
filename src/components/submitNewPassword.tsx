import styles from "../css/getPassword.module.css";
import { useNavigate } from "react-router-dom";
import { HOST_NAME } from "../lib";
import axios from "axios";
import { useState } from "react";
type Props = {
  title: string;
  text: string;
  placeholder: string;
  btn: string;
};

const NewPasswordCard = (props: Props) => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  async function switchPage(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    try {
      const response = await axios({
        url: `${HOST_NAME}/auth/resetPassword`,
        method: "PUT",
        data: {
          password: password,
        },
        headers: {
          token: token,
        },
        responseType: "json",
      });
      if (response.data) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className={styles.card}>
      <h1 className={styles.title}>{props.title}</h1>
      <h3 className={styles.text}>{props.text}</h3>
      <form onSubmit={switchPage}>
        <input
          className={styles.emailInput}
          onChange={(e) => setPassword(e.target.value)}
          type="text"
          name=""
          id=""
          placeholder={props.placeholder}
          minLength={8}
        />
        <div className={styles.buttons}>
          <button className={styles.btn2}>{props.btn}</button>
        </div>
      </form>
    </div>
  );
};

export default NewPasswordCard;