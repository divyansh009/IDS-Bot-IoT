import React from "react";
import { Routes, Route, Navigate } from "react-router";
import Init from "./Init";
import styles from './styles.module.css';
import Client from "Client";
import Server from "Server";

function App() {
  return (
    <div className={styles.root}>
      <Routes>
        <Route path="/" element={<Init/>} />
        <Route path="/client" element={<Client/>} />
        <Route path="/server" element={<Server/>} />
      </Routes>
    </div>
  );
}

export default App;
