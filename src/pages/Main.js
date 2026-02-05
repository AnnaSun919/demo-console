import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actionTypes from "../auth/types";

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleGetBooking = () => {
    navigate("/bookings");
  };

  const handleLogout = () => {
    window.localStorage.removeItem("auth_state");
    window.localStorage.removeItem("auth_role");
    window.localStorage.removeItem("auth_token");
    dispatch({ type: actionTypes.LOGOUT_SUCCESS });
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome</h1>
        <p style={styles.subtitle}>
          {isLoggedIn ? "You are logged in" : "Please log in to continue"}
        </p>

        {!isLoggedIn && (
          <button style={styles.button} onClick={handleLogin}>
            Login
          </button>
        )}
        <button style={styles.button} onClick={handleGetBooking}>
          Get Booking
        </button>
        {isLoggedIn && (
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        )}
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
    marginRight: "10px",
  },
  logoutButton: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    background: "#e74c3c",
    color: "#fff",
    marginTop: "15px",
  },
};

export default MainPage;
