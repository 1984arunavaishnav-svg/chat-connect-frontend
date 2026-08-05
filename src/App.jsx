import React, { useState } from "react";
import Chat from "./Chat";

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setJoined(true);
    }
  };

  return (
    <div style={styles.wrapper}>
      {!joined ? (
        <form onSubmit={handleJoin} style={styles.card}>
          <h2 style={{ marginTop: 0, color: "#333" }}>Chat Connect</h2>
          <p style={{ color: "#666", fontSize: "14px" }}>Enter your name to start chatting</p>
          <input
            type="text"
            placeholder="Apna Naam Likhein..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Join Chat Room
          </button>
        </form>
      ) : (
        <Chat username={username} />
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    backgroundColor: "#f0f2f5",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    fontFamily: "sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "100%",
    maxWidth: "360px",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "15px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    outline: "none",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
  },
};

export default App;
