import styles from "../css/getPassword.module.css";
import { useNavigate } from "react-router-dom";
type Props = {
  title: string;
  text: string;
  placeholder: string;
  btn1: string;
  btn2: string;
};

const NewPasswordCard = (props: Props) => {
  const navigate = useNavigate();
  function switchPage(): void {
    // e.preventDefault();
    console.log(4444);
    navigate("/");
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
              navigate("/submitCod");
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

export default NewPasswordCard;
