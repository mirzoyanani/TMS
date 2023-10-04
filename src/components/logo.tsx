import styles from "../css/login.module.css";
const logo = () => {
  return (
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
  );
};

export default logo;
