import styles from "../css/getPassword.module.css";
import PasswordCard from "../components/submitNewPassword";

const newPassword = () => {
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
      <PasswordCard
        title="Choose a new password"
        text="Create a new password that is at least 6 characters long. A strong password is combination of letters, numbers, and punctuation marks."
        placeholder="Write new Password"
        btn1="Cancel"
        btn2="Continue"
      />
    </div>
  );
};

export default newPassword;
