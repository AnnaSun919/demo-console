import React from "react";

const BaseIcon = ({ color, pushRight = true, children }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginRight: pushRight ? "20px" : "0", minWidth: 24 }}
  >
    {children}
  </svg>
);

const InfoIcon = () => (
  <BaseIcon color="#2E9AFE">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="8" />
  </BaseIcon>
);

const SuccessIcon = () => (
  <BaseIcon color="#31B404">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </BaseIcon>
);

const ErrorIcon = () => (
  <BaseIcon color="#FF0040">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12" y2="16" />
  </BaseIcon>
);

const WarningIcon = () => (
  <BaseIcon color="#F59E0B">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </BaseIcon>
);

const CloseIcon = () => (
  <BaseIcon color="#FFFFFF" pushRight={false}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </BaseIcon>
);

const typeStyles = {
  info: { backgroundColor: "#151515" },
  success: { backgroundColor: "#1B4332" },
  error: { backgroundColor: "#4A1515" },
  warning: { backgroundColor: "#422006" },
};

const baseStyle = {
  color: "white",
  padding: "10px",
  textTransform: "uppercase",
  borderRadius: "3px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.03)",
  fontFamily: "Arial",
  width: "300px",
  boxSizing: "border-box",
};

const buttonStyle = {
  marginLeft: "20px",
  border: "none",
  backgroundColor: "transparent",
  cursor: "pointer",
  color: "#FFFFFF",
};

export default function ReactAlertTemplate({ message, options, style, close }) {
  const alertType = options.type || "info";

  return (
    <div style={{ ...baseStyle, ...typeStyles[alertType], ...style }}>
      {alertType === "info" && <InfoIcon />}
      {alertType === "success" && <SuccessIcon />}
      {alertType === "error" && <ErrorIcon />}
      {alertType === "warning" && <WarningIcon />}
      <span style={{ flex: 2 }}>{message}</span>
      <button type="button" onClick={close} style={buttonStyle}>
        <CloseIcon />
      </button>
    </div>
  );
}
