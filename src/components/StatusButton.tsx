import styles from "../css/generalPage.module.css";

interface Props {
  body: string;
  setStatus: (arg: string) => void;
  setPage: (arg: number) => void;
  status: string;
}

const Button = ({ body, setStatus, setPage, status }: Props) => (
  <button
    style={{ backgroundColor: status === body ? "#91abdb" : "beige" }}
    className={styles.taskstatus}
    onClick={() => {
      const newStatus = status === body ? "" : body;
      setStatus(newStatus);
      setPage(1);
    }}
  >
    {body}
  </button>
);

export default Button;
