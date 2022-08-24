import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Init = (props) => {
  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <div className={styles.col1} onClick={() => navigate("/client")}>
        <p className={styles.title}>Client</p>
      </div>
      <div className={styles.col2} onClick={() => navigate("/server")}>
        <p className={styles.title}>Server</p>
      </div>
    </div>
  );
};

export default Init;