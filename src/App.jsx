import React, { useState } from "react";
import Chat from "./Chat";

export default function App() {
  const [view, setView] = useState("landing"); // 'landing', 'login', 'signup', 'pending', 'chat', 'admin'
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [currentUser, setCurrentUser] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Admin Security Password
  const ADMIN_EMAIL = "admin@conection.com";
  const ADMIN_PASSWORD = "Admin@1234";

  // Admin Members State
  const [activeTab, setActiveTab] = useState("Approved"); // 'Pending', 'Approved', 'Rejected'
  const [members, setMembers] = useState([
    { id: 1, name: "Mihika", email: "mihika@gmail.com", status: "Approved" },
    { id: 2, name: "Shubh", email: "shubh786vaishnav@gmail.com", status: "Approved" },
    { id: 3, name: "Aruna", email: "aruna@gmail.com", status: "Pending" }
  ]);

  const BACKEND_URL = "https://chat-connect-frontend-s5tp.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e, isSignup) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const inputEmail = formData.email.trim().toLowerCase();

    // Admin Verification Check
    if (!isSignup && inputEmail === ADMIN_EMAIL) {
      setIsLoading(false);
      if (formData.password === ADMIN_PASSWORD) {
        setCurrentUser("Admin");
        setView("admin");
      } else {
        setMessage("Galat Password! Admin login ke liye sahi password dalein.");
      }
      return;
    }

    const endpoint = isSignup ? "/signup" : "/login";

    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.error) {
        setMessage(data.error);
        return;
      }

      if (isSignup) {
        setView("pending");
      } else {
        if (data.status === "pending") {
          setView("pending");
        } else {
          setCurrentUser(data.username || formData.username || "User");
          setView("chat");
        }
      }
    } catch (err) {
      setIsLoading(false);
      // Fallback for regular user
      setCurrentUser(formData.username || "User");
      setView("chat");
    }
  };

  // Member Action Handlers
  const handleUpdateStatus = (id, newStatus) => {
    setMembers(members.map(m => m.id === id ? { ...m, status: newStatus } : m));
  };

  // Stats calculation
  const pendingCount = members.filter(m => m.status === "Pending").length;
  const approvedCount = members.filter(m => m.status === "Approved").length;
  const rejectedCount = members.filter(m => m.status === "Rejected").length;

  // 1. Chat Room View (User & Admin)
  if (view === "chat") {
    return (
      <div style={{ backgroundColor: "#FAF8F5", minHeight: "100vh", padding: "20px 10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "600px", margin: "0 auto 15px" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: "bold", color: "#0F172A" }}>Conection.</span>
          <div style={{ display: "flex", gap: "10px" }}>
            {currentUser === "Admin" && (
              <button 
                onClick={() => setView("admin")} 
                style={{ padding: "8px 16px", backgroundColor: "#334155", color: "#fff", border: "none", borderRadius: "20px", cursor: "pointer", fontSize: "13px" }}
              >
                Admin Panel
              </button>
            )}
            <button 
              onClick={() => setView("landing")} 
              style={{ padding: "8px 18px", backgroundColor: "#0F172A", color: "#fff", border: "none", borderRadius: "20px", cursor: "pointer", fontSize: "13px" }}
            >
              Logout
            </button>
          </div>
        </div>
        <Chat username={currentUser} />
      </div>
    );
  }

  // 2. Admin Dashboard View
  if (view === "admin") {
    const filteredMembers = members.filter(m => m.status === activeTab);

    return (
      <div style={styles.pageWrapper}>
        <header style={styles.adminHeader}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={styles.logo}>Conection.</span>
              <span style={{ fontSize: "14px", color: "#64748B" }}>Admin</span>
            </div>
            <p style={{ fontSize: "13px", color: "#64748B", margin: "4px 0 0 0" }}>
              Signed in as <strong style={{ color: "#0F172A" }}>admin@conection.com</strong>
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button 
              onClick={() => setView("chat")} 
              style={{ padding: "8px 16px", backgroundColor: "#0F172A", color: "#fff", border: "none", borderRadius: "20px", cursor: "pointer", fontSize: "13px" }}
            >
              Open Chat Room 💬
            </button>
            <button 
              onClick={() => setView("landing")} 
              style={{ padding: "8px 16px", backgroundColor: "#FFF", border: "1px solid #CBD5E1", borderRadius: "20px", cursor: "pointer", fontSize: "13px", color: "#0F172A" }}
            >
              Log out
            </button>
          </div>
        </header>

        <main style={{ maxWidth: "600px", margin: "30px auto 0", padding: "0 20px" }}>
          <div style={styles.statsGrid}>
            <div>
              <div style={styles.statLabel}>PENDING</div>
              <div style={styles.statNumber}>{pendingCount}</div>
            </div>
            <div>
              <div style={styles.statLabel}>APPROVED</div>
              <div style={styles.statNumber}>{approvedCount}</div>
            </div>
            <div>
              <div style={styles.statLabel}>REJECTED</div>
              <div style={styles.statNumber}>{rejectedCount}</div>
            </div>
          </div>

          <div style={{ marginTop: "40px" }}>
            <div style={styles.statLabel}>MEMBERS</div>
            <h2 style={styles.adminTitle}>Who joins the room.</h2>
          </div>

          <div style={styles.tabsContainer}>
            {["Pending", "Approved", "Rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.tabButton,
                  borderBottom: activeTab === tab ? "2px solid #0F172A" : "2px solid transparent",
                  color: activeTab === tab ? "#0F172A" : "#64748B",
                  fontWeight: activeTab === tab ? "600" : "400",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
            {filteredMembers.length === 0 ? (
              <p style={{ color: "#64748B", fontSize: "14px" }}>No members in {activeTab}.</p>
            ) : (
              filteredMembers.map((member) => {
                const initials = member.name.substring(0, 2).toUpperCase();
                return (
                  <div key={member.id} style={styles.memberRow}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={styles.avatarDark}>{initials}</div>
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "15px", color: "#0F172A" }}>{member.name}</div>
                        <div style={{ fontSize: "13px", color: "#64748B" }}>{member.email}</div>
                      </div>
                    </div>

                    <div>
                      {activeTab === "Pending" && (
                        <div style={{ display: "flex", gap: "12px" }}>
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

  // 3. Landing Page View
  return (
    <div style={styles.pageWrapper}>
      <header style={styles.navbar}>
        <div style={styles.logo} onClick={() => setView("landing")}>Conection.</div>
        <div style={styles.navLinks}>
          <button style={styles.textBtn} onClick={() => { setMessage(""); setView("login"); }}>
            Sign in
          </button>
          <button style={styles.primaryBtnSmall} onClick={() => { setMessage(""); setView("signup"); }}>
            Get started
          </button>
        </div>
      </header>

      {(view === "login" || view === "signup" || view === "pending") && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button style={styles.closeBtn} onClick={() => setView("landing")}>✕</button>
            
            {view === "pending" ? (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>⏳</div>
                <h2 style={styles.serifHeading}>Account Pending</h2>
                <p style={{ color: "#64748B", fontSize: "14px", lineHeight: "1.5", margin: "15px 0" }}>
                  Aapka account successfully submit ho gaya hai! Admin approval ke baad aap login kar sakte hain.
                </p>
                <button style={styles.primaryBtnFull} onClick={() => setView("landing")}>
                  Back to Home
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => handleAuth(e, view === "signup")}>
                <h2 style={styles.serifHeading}>
                  {view === "signup" ? "Request an Account" : "Sign In"}
                </h2>
                <p style={{ color: "#64748B", fontSize: "13px", marginBottom: "20px" }}>
                  {view === "signup" ? "Enter your details to join the private chat room." : "Welcome back! Access your messages."}
                </p>

                {message && <div style={styles.errorMsg}>{message}</div>}

                {view === "signup" && (
                  <input
                    type="text"
                    name="username"
                    placeholder="Your Name"
                    value={formData.username}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                )}
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />

                <button type="submit" style={styles.primaryBtnFull} disabled={isLoading}>
                  {isLoading ? "Processing..." : view === "signup" ? "Submit Request" : "Sign In"}
                </button>

                <div style={{ marginTop: "18px", textAlign: "center", fontSize: "13px", color: "#64748B" }}>
                  {view === "signup" ? (
                    <span>
                      Already have an account?{" "}
                      <strong style={{ cursor: "pointer", color: "#0F172A", textDecoration: "underline" }} onClick={() => { setMessage(""); setView("login"); }}>
                        Sign in
                      </strong>
                    </span>
                  ) : (
                    <span>
                      Need an account?{" "}
                      <strong style={{ cursor: "pointer", color: "#0F172A", textDecoration: "underline" }} onClick={() => { setMessage(""); setView("signup"); }}>
                        Request one
                      </strong>
                    </span>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <main style={styles.mainContent}>
        <div style={styles.heroGrid}>
          <div style={styles.heroTextContainer}>
            <div style={styles.subTag}>A QUIETER PLACE TO CHAT</div>
            
            <h1 style={styles.mainTitle}>
              Conversations,<br />
              <span style={{ fontStyle: "italic", fontWeight: "normal" }}>unhurried.</span>
            </h1>

            <p style={styles.description}>
              A private, invite-controlled chat room for the people who matter. No noise, no ads, no algorithms — just plain, honest messages that feel like reading a letter.
            </p>

            <div style={styles.ctaGroup}>
              <button style={styles.primaryBtnLarge} onClick={() => { setMessage(""); setView("signup"); }}>
                Request an account &nbsp; →
              </button>
              
              <button style={styles.textLinkBtn} onClick={() => { setMessage(""); setView("login"); }}>
                I already have one
              </button>
            </div>
          </div>

          <div style={styles.heroCardContainer}>
            <div style={styles.previewCard}>
              <div style={styles.chatHeader}>
                <div style={styles.avatarDark}>AS</div>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "15px", color: "#0F172A" }}>Ananya S.</div>
                  <div style={{ fontSize: "12px", color: "#16A34A", fontWeight: "500" }}>online now</div>
                </div>
              </div>

              <div style={styles.chatBody}>
                <div style={styles.msgLeft}>Kal shaam free ho?</div>
                <div style={styles.msgRight}>Bilkul. Coffee ke liye milte hain.</div>
                <div style={styles.msgLeft}>6 baje?</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: "#FAF8F5",
    minHeight: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: "#1E293B",
    paddingBottom: "80px",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 32px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  adminHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 32px",
    maxWidth: "1100px",
    margin: "0 auto",
    borderBottom: "1px solid #E2E8F0",
  },
  logo: {
    fontFamily: "Georgia, serif",
    fontSize: "26px",
    fontWeight: "bold",
    color: "#0F172A",
    cursor: "pointer",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  textBtn: {
    background: "none",
    border: "none",
    color: "#334155",
    fontSize: "15px",
    cursor: "pointer",
    padding: "8px 12px",
  },
  primaryBtnSmall: {
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "20px",
    padding: "10px 22px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  mainContent: {
    maxWidth: "1100px",
    margin: "40px auto 0",
    padding: "0 24px",
  },
  heroGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "40px",
  },
  heroTextContainer: {
    flex: "1 1 480px",
    maxWidth: "560px",
  },
  heroCardContainer: {
    flex: "1 1 380px",
    maxWidth: "440px",
    width: "100%",
  },
  subTag: {
    fontSize: "11px",
    letterSpacing: "1.5px",
    color: "#64748B",
    fontWeight: "600",
    textTransform: "uppercase",
    borderBottom: "1px solid #CBD5E1",
    display: "inline-block",
    paddingBottom: "4px",
    marginBottom: "20px",
  },
  mainTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "48px",
    lineHeight: "1.15",
    fontWeight: "normal",
    color: "#0F172A",
    margin: "0 0 24px 0",
  },
  description: {
    fontSize: "17px",
    lineHeight: "1.6",
    color: "#475569",
    margin: "0 0 36px 0",
  },
  ctaGroup: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  primaryBtnLarge: {
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "30px",
    padding: "16px 28px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
  },
  textLinkBtn: {
    background: "none",
    border: "none",
    color: "#0F172A",
    fontSize: "15px",
    cursor: "pointer",
    textDecoration: "underline",
  },
  previewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.07)",
    border: "1px solid #F1F5F9",
  },
  chatHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    paddingBottom: "18px",
    borderBottom: "1px solid #F1F5F9",
    marginBottom: "18px",
  },
  avatarDark: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "#0F172A",
    color: "#FFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "15px",
  },
  chatBody: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  msgLeft: {
    backgroundColor: "#F1F5F9",
    color: "#1E293B",
    padding: "12px 18px",
    borderRadius: "18px",
    borderBottomLeftRadius: "4px",
    alignSelf: "flex-start",
    maxWidth: "80%",
    fontSize: "14px",
  },
  msgRight: {
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    padding: "12px 18px",
    borderRadius: "18px",
    borderBottomRightRadius: "4px",
    alignSelf: "flex-end",
    maxWidth: "80%",
    fontSize: "14px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "20px",
    paddingBottom: "20px",
  },
  statLabel: {
    fontSize: "11px",
    letterSpacing: "1.5px",
    color: "#64748B",
    fontWeight: "600",
    borderBottom: "1px solid #CBD5E1",
    display: "inline-block",
    paddingBottom: "4px",
    marginBottom: "8px",
  },
  statNumber: {
    fontFamily: "Georgia, serif",
    fontSize: "36px",
    color: "#0F172A",
  },
  adminTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "36px",
    fontWeight: "normal",
    color: "#0F172A",
    margin: "8px 0 20px 0",
  },
  tabsContainer: {
    display: "flex",
    gap: "24px",
    borderBottom: "1px solid #E2E8F0",
    marginBottom: "15px",
  },
  tabButton: {
    background: "none",
    border: "none",
    padding: "10px 0",
    fontSize: "15px",
    cursor: "pointer",
  },
  memberRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #F1F5F9",
  },
  revokeBtn: {
    background: "none",
    border: "none",
    color: "#C2410C",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "500",
  },
  approveBtn: {
    background: "none",
    border: "none",
    color: "#15803D",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "500",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "20px",
    padding: "36px",
    width: "100%",
    maxWidth: "400px",
    position: "relative",
    boxShadow: "0 25px 30px -5px rgba(0, 0, 0, 0.15)",
  },
  closeBtn: {
    position: "absolute",
    top: "18px",
    right: "18px",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#64748B",
  },
  serifHeading: {
    fontFamily: "Georgia, serif",
    fontSize: "26px",
    fontWeight: "normal",
    color: "#0F172A",
    margin: "0 0 8px 0",
  },
  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "14px",
    borderRadius: "10px",
    border: "1px solid #CBD5E1",
    boxSizing: "border-box",
    fontSize: "14px",
    outline: "none",
  },
  primaryBtnFull: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#0F172A",
    color: "#FFF",
    border: "none",
    borderRadius: "10px",
    fontWeight: "500",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "8px",
  },
  errorMsg: {
    color: "#DC2626",
    fontSize: "13px",
    marginBottom: "14px",
  },
};
