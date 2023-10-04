import styles from "../css/getPassword.module.css";
import { useNavigate } from "react-router-dom";
type Props = {
  title: string;
  text: string;
  placeholder: string;
  btn1: string;
  btn2: string;
};

const EmailCard = (props: Props) => {
  const navigate = useNavigate();
  function switchPage(): void {
    console.log(555);
    navigate("/submitCod");
  }
  return (
    <div className={styles.card}>
      <h1 className={styles.title}>{props.title}</h1>
      <h3 className={styles.text}>{props.text}</h3>
      <form>
        <input className={styles.emailInput} type="email" name="" id="" placeholder={props.placeholder} />
        <div className={styles.buttons}>
          <button
            onClick={() => {
              navigate("/");
            }}
            className={styles.btn1}
          >
            {props.btn1}
          </button>
          <button onClick={switchPage} className={styles.btn2}>
            {props.btn2}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailCard;
