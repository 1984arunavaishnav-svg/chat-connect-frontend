import React, { useState, useEffect } from "react";
import { socket } from "./socket";

export default function Chat({ username }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Socket connection establish karein
    socket.connect();

    // Backend se incoming message receive karein
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const msgData = {
        sender: username || "User",
        text: message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      // Backend ko event emit karein
      socket.emit("send_message", msgData);

      // Current screen par message add karein
      setMessages((prev) => [...prev, msgData]);
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={{ margin: 0 }}>Chat Connect Room</h3>
        <span style={{ fontSize: "14px" }}>User: <strong>{username || "Guest"}</strong></span>
      </div>

      <div style={styles.chatBox}>
        {messages.map((msg, index) => {
          const isMe = msg.sender === (username || "Guest");
          return (
            <div
              key={index}
              style={{
                ...styles.messageWrapper,
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.messageBubble,
                  backgroundColor: isMe ? "#007bff" : "#e9ecef",
                  color: isMe ? "#fff" : "#000",
                }}
              >
                <small style={styles.senderName}>{msg.sender}</small>
                <p style={styles.messageText}>{msg.text}</p>
                <span style={styles.timeText}>{msg.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={sendMessage} style={styles.inputArea}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.sendBtn}>
          Send
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "20px auto",
    border: "1px solid #ddd",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    height: "80vh",
    backgroundColor: "#ffffff",
    fontFamily: "sans-serif",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  header: {
    padding: "15px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
  },
  chatBox: {
    flex: 1,
    padding: "15px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  messageWrapper: {
    display: "flex",
  },
  messageBubble: {
    padding: "8px 12px",
    borderRadius: "12px",
    maxWidth: "75%",
    wordBreak: "break-word",
  },
  senderName: {
    fontSize: "10px",
    opacity: 0.8,
    display: "block",
  },
  messageText: {
    margin: "4px 0",
    fontSize: "14px",
  },
  timeText: {
    fontSize: "9px",
    opacity: 0.7,
    display: "block",
    textAlign: "right",
  },
  inputArea: {
    display: "flex",
    padding: "12px",
    borderTop: "1px solid #eee",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    outline: "none",
  },
  sendBtn: {
    marginLeft: "8px",
    padding: "10px 18px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
