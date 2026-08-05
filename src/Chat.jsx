import React, { useState } from "react";

export default function Chat({ username = "om", onLogout }) {
  // Sample user list
  const [users] = useState([
    { id: 1, name: "Shubh", email: "shubh786vaishnav@gmail.com", status: "online" },
    { id: 2, name: "Mihika", email: "mihika@gmail.com", status: "offline" },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState({});
  const [inputMsg, setInputMsg] = useState("");

  // Search filter
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !selectedUser) return;

    const userMsgs = messages[selectedUser.id] || [];
    setMessages({
      ...messages,
      [selectedUser.id]: [
        ...userMsgs,
        { id: Date.now(), sender: "me", text: inputMsg, time: "Just now" },
      ],
    });
    setInputMsg("");
  };

  const activeMessages = selectedUser ? messages[selectedUser.id] || [] : [];

  return (
    <div style={styles.container}>
      {/* 1. USER SELECTION VIEW (Agar koi user select nahi hua) */}
      {!selectedUser ? (
        <div style={styles.listCard}>
          {/* Header */}
          <div style={styles.header}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={styles.myAvatar}>
                {username.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={styles.logoTitle}>Conection<span style={{ color: "#6366F1" }}>.</span></div>
                <div style={styles.signedInText}>Signed in as <strong style={{ color: "#F8FAFC" }}>{username}</strong></div>
              </div>
            </div>
            {onLogout && (
              <button onClick={onLogout} style={styles.iconBtn} title="Logout">
                🚪
              </button>
            )}
          </div>

          {/* Search Box */}
          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="🔍 Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* User List */}
          <div style={styles.userList}>
            {filteredUsers.length === 0 ? (
              <div style={styles.emptyText}>No users found</div>
            ) : (
              filteredUsers.map((user) => {
                const initials = user.name.substring(0, 2).toUpperCase();
                return (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    style={styles.userRow}
                  >
                    <div style={{ position: "relative" }}>
                      <div style={styles.userAvatar}>{initials}</div>
                      <span
                        style={{
                          ...styles.statusDot,
                          backgroundColor: user.status === "online" ? "#34D399" : "#64748B",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={styles.userName}>{user.name}</div>
                      <div style={styles.userEmail}>{user.email}</div>
                    </div>
                    <span style={styles.arrowIcon}>→</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* 2. CHAT MESSAGING VIEW (Jab user par click kiya jaye) */
        <div style={styles.chatCard}>
          {/* Chat Header */}
          <div style={styles.chatHeader}>
            <button onClick={() => setSelectedUser(null)} style={styles.backBtn}>
              ← Back
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={styles.userAvatarSmall}>
                {selectedUser.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={styles.userName}>{selectedUser.name}</div>
                <div style={styles.userStatus}>
                  {selectedUser.status === "online" ? "● Online" : "Offline"}
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div style={styles.chatBody}>
            {activeMessages.length === 0 ? (
              <div style={styles.startConversation}>
                Start a conversation with <strong style={{ color: "#F8FAFC" }}>{selectedUser.name}</strong>
              </div>
            ) : (
              activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={msg.sender === "me" ? styles.msgRight : styles.msgLeft}
                >
                  <div>{msg.text}</div>
                  <div style={styles.msgTime}>{msg.time}</div>
                </div>
              ))
            )}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} style={styles.inputForm}>
            <input
              type="text"
              placeholder="Type a message..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              style={styles.messageInput}
            />
            <button type="submit" style={styles.sendBtn}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: "480px", margin: "0 auto", padding: "10px", boxSizing: "border-box",
  },
  listCard: {
    width: "100%", backgroundColor: "#131825", borderRadius: "24px", padding: "20px", border: "1px solid #1E293B", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)", boxSizing: "border-box",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid #1E293B", marginBottom: "16px",
  },
  myAvatar: {
    width: "42px", height: "42px", borderRadius: "14px", background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px",
  },
  logoTitle: { fontSize: "18px", fontWeight: "800", color: "#F8FAFC", margin: 0 },
  signedInText: { fontSize: "12px", color: "#94A3B8" },
  iconBtn: { background: "rgba(255,255,255,0.05)", border: "none", color: "#F8FAFC", padding: "8px", borderRadius: "10px", cursor: "pointer", fontSize: "16px" },
  searchWrapper: { marginBottom: "16px" },
  searchInput: {
    width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #334155", backgroundColor: "#0B0F19", color: "#F8FAFC", fontSize: "14px", outline: "none", boxSizing: "border-box",
  },
  userList: { display: "flex", flexDirection: "column", gap: "10px", maxHeight: "400px", overflowY: "auto" },
  userRow: {
    display: "flex", alignItems: "center", gap: "14px", padding: "12px 16px", backgroundColor: "#0B0F19", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.03)", cursor: "pointer", transition: "0.2s",
  },
  userAvatar: {
    width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "#1E293B", color: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px",
  },
  statusDot: { width: "10px", height: "10px", borderRadius: "50%", position: "absolute", bottom: "0", right: "0", border: "2px solid #0B0F19" },
  userName: { fontWeight: "600", fontSize: "15px", color: "#F8FAFC" },
  userEmail: { fontSize: "12px", color: "#94A3B8" },
  arrowIcon: { color: "#6366F1", fontSize: "16px", fontWeight: "700" },
  emptyText: { textAlign: "center", color: "#94A3B8", padding: "20px 0", fontSize: "14px" },
  chatCard: {
    width: "100%", backgroundColor: "#131825", borderRadius: "24px", padding: "20px", border: "1px solid #1E293B", display: "flex", flexDirection: "column", height: "520px", boxSizing: "border-box",
  },
  chatHeader: { display: "flex", alignItems: "center", gap: "14px", paddingBottom: "14px", borderBottom: "1px solid #1E293B", marginBottom: "14px" },
  backBtn: { backgroundColor: "#0B0F19", border: "1px solid #334155", color: "#F8FAFC", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontWeight: "600" },
  userAvatarSmall: { width: "34px", height: "34px", borderRadius: "10px", background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px" },
  userStatus: { fontSize: "11px", color: "#34D399" },
  chatBody: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", paddingRight: "4px" },
  startConversation: { textAlign: "center", color: "#94A3B8", margin: "auto 0", fontSize: "13px" },
  msgLeft: { backgroundColor: "#1E293B", color: "#F8FAFC", padding: "10px 14px", borderRadius: "14px", borderBottomLeftRadius: "2px", alignSelf: "flex-start", maxWidth: "75%", fontSize: "13px" },
  msgRight: { background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)", color: "#FFFFFF", padding: "10px 14px", borderRadius: "14px", borderBottomRightRadius: "2px", alignSelf: "flex-end", maxWidth: "75%", fontSize: "13px" },
  msgTime: { fontSize: "9px", opacity: 0.7, marginTop: "4px", textAlign: "right" },
  inputForm: { display: "flex", gap: "8px", marginTop: "14px" },
  messageInput: { flex: 1, padding: "12px 14px", borderRadius: "12px", border: "1px solid #334155", backgroundColor: "#0B0F19", color: "#F8FAFC", fontSize: "14px", outline: "none" },
  sendBtn: { padding: "0 18px", background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)", color: "#FFF", border: "none", borderRadius: "12px", fontWeight: "600", cursor: "pointer", fontSize: "13px" },
};
