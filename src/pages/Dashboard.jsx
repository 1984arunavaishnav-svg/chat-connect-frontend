import React, { useState } from "react";

export default function Dashboard({ onOpenChat, onLogout }) {
  const [activeTab, setActiveTab] = useState("Approved");
  const [members, setMembers] = useState([
    { id: 1, name: "Mihika", email: "mihika@gmail.com", status: "Approved" },
    { id: 2, name: "Shubh", email: "shubh786vaishnav@gmail.com", status: "Approved" },
    { id: 3, name: "Aruna", email: "aruna@gmail.com", status: "Pending" }
  ]);

  const handleUpdateStatus = (id, newStatus) => {
    setMembers(members.map(m => m.id === id ? { ...m, status: newStatus } : m));
  };

  const pendingCount = members.filter(m => m.status === "Pending").length;
  const approvedCount = members.filter(m => m.status === "Approved").length;
  const rejectedCount = members.filter(m => m.status === "Rejected").length;

  const filteredMembers = members.filter(m => m.status === activeTab);

  return (
    <div style={styles.pageWrapper}>
      {/* Header */}
      <header style={styles.adminHeader}>
        <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
          <div style={styles.logo}>Conection<span style={{color: "#6366F1"}}>.</span></div>
          <span style={styles.badge}>ADMIN</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={onOpenChat} style={styles.primaryBtn}>
            Open Chat 💬
          </button>
          <button onClick={onLogout} style={styles.outlineBtn}>
            Log out
          </button>
        </div>
      </header>

      {/* Main Dashboard */}
      <main style={styles.mainContainer}>
        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>PENDING</div>
            <div style={styles.statNumber}>{pendingCount}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>APPROVED</div>
            <div style={styles.statNumber}>{approvedCount}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>REJECTED</div>
            <div style={styles.statNumber}>{rejectedCount}</div>
          </div>
        </div>

        {/* Section Heading */}
        <div style={{ marginTop: "36px", marginBottom: "20px" }}>
          <h2 style={styles.adminTitle}>Room Members Management</h2>
        </div>

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          {["Pending", "Approved", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tabButton,
                borderBottom: activeTab === tab ? "2px solid #6366F1" : "2px solid transparent",
                color: activeTab === tab ? "#F8FAFC" : "#94A3B8",
                fontWeight: activeTab === tab ? "600" : "500",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredMembers.length === 0 ? (
            <p style={{ color: "#94A3B8", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>No members found in {activeTab}.</p>
          ) : (
            filteredMembers.map((member) => {
              const initials = member.name.substring(0, 2).toUpperCase();
              return (
                <div key={member.id} style={styles.memberRow}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={styles.avatarDark}>{initials}</div>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "15px", color: "#F8FAFC" }}>{member.name}</div>
                      <div style={{ fontSize: "13px", color: "#94A3B8" }}>{member.email}</div>
                    </div>
                  </div>

                  <div>
                    {activeTab === "Pending" && (
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={() => handleUpdateStatus(member.id, "Approved")} style={styles.approveBtn}>Approve</button>
                        <button onClick={() => handleUpdateStatus(member.id, "Rejected")} style={styles.revokeBtn}>Reject</button>
                      </div>
                    )}
                    {activeTab === "Approved" && (
                      <button onClick={() => handleUpdateStatus(member.id, "Rejected")} style={styles.revokeBtn}>Revoke</button>
                    )}
                    {activeTab === "Rejected" && (
                      <button onClick={() => handleUpdateStatus(member.id, "Approved")} style={styles.approveBtn}>Approve</button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: "#090A0F", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif", color: "#F8FAFC", paddingBottom: "80px",
  },
  adminHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 32px",
    maxWidth: "1000px", margin: "0 auto", borderBottom: "1px solid #1E293B", boxSizing: "border-box", flexWrap: "wrap", gap: "16px",
  },
  logo: { fontSize: "20px", fontWeight: "800", color: "#F8FAFC", letterSpacing: "-0.5px" },
  badge: { backgroundColor: "rgba(99, 102, 241, 0.1)", color: "#818CF8", border: "1px solid rgba(99, 102, 241, 0.2)", padding: "2px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700" },
  primaryBtn: {
    padding: "8px 16px", background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
    color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
  },
  outlineBtn: {
    padding: "8px 16px", backgroundColor: "#131825", border: "1px solid #334155", borderRadius: "10px",
    cursor: "pointer", fontSize: "13px", color: "#F8FAFC", fontWeight: "500",
  },
  mainContainer: { maxWidth: "800px", margin: "30px auto 0", padding: "0 20px", boxSizing: "border-box" },
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px",
  },
  statCard: {
    backgroundColor: "#131825", borderRadius: "16px", padding: "20px", border: "1px solid #1E293B",
  },
  statLabel: { fontSize: "11px", letterSpacing: "1.2px", color: "#94A3B8", fontWeight: "700", marginBottom: "6px" },
  statNumber: { fontSize: "32px", fontWeight: "700", color: "#F8FAFC" },
  adminTitle: { fontSize: "20px", fontWeight: "700", color: "#F8FAFC", margin: "0" },
  tabsContainer: { display: "flex", gap: "24px", borderBottom: "1px solid #1E293B", marginBottom: "20px" },
  tabButton: { background: "none", border: "none", padding: "10px 0", fontSize: "14px", cursor: "pointer" },
  memberRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px",
    backgroundColor: "#131825", borderRadius: "14px", border: "1px solid #1E293B", flexWrap: "wrap", gap: "12px",
  },
  avatarDark: {
    width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
    color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px",
  },
  revokeBtn: {
    background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#F87171",
    padding: "6px 12px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: "600",
  },
  approveBtn: {
    background: "rgba(52, 211, 153, 0.1)", border: "1px solid rgba(52, 211, 153, 0.2)", color: "#34D399",
    padding: "6px 12px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: "600",
  },
};
