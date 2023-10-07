import styles from "../css/getPassword.module.css";
import PasswordCard from "../components/SearchEmailCard";
const forgetPassword = () => {
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
        title="Write your email"
        text="Please enter your email or mobile number to search for your account."
        placeholder="email or telephone"
        btn="Search"
      />
    </div>
  );
};

export default forgetPassword;
