
import React from "react";

export default function Modal({ children, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}>×</button>
        {children}
      </div>
    </>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    zIndex: 1000,
    maxWidth: "600px",
    width: "90%",
    maxHeight: "80vh",   
    overflowY: "auto",
  },
  closeBtn: {
    position: "absolute",
    top: "12px",
    right: "15px",
    background: "transparent",
    border: "none",
    fontSize: "28px",
    cursor: "pointer",
    color: "#999",
  },
};
