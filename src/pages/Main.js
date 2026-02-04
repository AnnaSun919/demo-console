import React from "react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  //if login already shows booking dashboard 
  //auto run fetch booking data 
  const handleLogin = () => {
    // later: redirect to login page or open modal
    console.log("testing login")
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome</h1>
        <p style={styles.subtitle}>
          Please log in to continue
        </p>

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    width: "320px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  title: {
    marginBottom: "10px",
  },
  subtitle: {
    color: "#666",
    marginBottom: "30px",
  },
  button: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    background: "#667eea",
    color: "#fff",
  },
};

export default MainPage;
