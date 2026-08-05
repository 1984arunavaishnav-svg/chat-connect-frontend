import React, { useState } from "react";
import Chat from "./Chat";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Pending from "./pages/Pending";
import Profile from "./pages/Profile";

export default function App() {
  const [view, setView] = useState("landing");
  const [currentUser, setCurrentUser] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");

  const ADMIN_EMAIL = "admin@conection.com";
  const ADMIN_PASSWORD = "Admin@1234";
  const BACKEND_URL = "https://chat-connect-frontend-s5tp.onrender.com";

  const handleLogin = async (email, password, callback) => {
    const inputEmail = email.trim().toLowerCase();

    if (inputEmail === ADMIN_EMAIL) {
      if (password === ADMIN_PASSWORD) {
        setCurrentUser("Admin");
        setCurrentEmail(ADMIN_EMAIL);
        setView("admin");
      } else {
        callback("Galat Password! Admin login ke liye sahi password dalein.");
      }
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.error) {
        callback(data.error);
        return;
      }

      if (data.status === "pending") {
        setView("pending");
      } else {
        setCurrentUser(data.username || "User");
        setCurrentEmail(email);
        setView("chat");
      }
    } catch (err) {
      setCurrentUser("User");
      setCurrentEmail(email);
      setView("chat");
    }
  };

  const handleSignup = async (formData, callback) => {
    try {
      const res = await fetch(`${BACKEND_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.error) {
        callback(data.error);
        return;
      }
      setCurrentEmail(formData.email);
      setView("pending");
    } catch (err) {
      setView("pending");
    }
  };

  if (view === "admin") {
    return <Dashboard onOpenChat={() => setView("chat")} onLogout={() => setView("landing")} />;
  }

  if (view === "profile") {
    return <Profile username={currentUser} email={currentEmail} onBackToChat={() => setView("chat")} />;
  }

  if (view === "chat") {
    return (
      <div style={{ backgroundColor: "#090A0F", minHeight: "100vh", padding: "20px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "700px", margin: "0 auto 20px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ fontSize: "20px", fontWeight: "800", color: "#F8FAFC" }}>Conection<span style={{color: "#6366F1"}}>.</span></div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setView("profile")} style={styles.navBtnAlt}>Profile 👤</button>
            {currentUser === "Admin" && (
              <button onClick={() => setView("admin")} style={styles.navBtnAlt}>Admin Panel</button>
            )}
            <button onClick={() => setView("landing")} style={styles.navBtnPrimary}>Logout</button>
          </div>
        </div>
        <Chat username={currentUser} />
      </div>
    );
  }

  if (view === "login") return <Login onLogin={handleLogin} onSwitchToSignup={() => setView("signup")} onBack={() => setView("landing")} />;
  if (view === "signup") return <Signup onSignup={handleSignup} onSwitchToLogin={() => setView("login")} onBack={() => setView("landing")} />;
  if (view === "pending") return <Pending onBack={() => setView("landing")} />;

  // Landing Page
  return (
    <div style={styles.pageWrapper}>
      <header style={styles.navbar}>
        <div style={styles.logo} onClick={() => setView("landing")}>Conection<span style={{color: "#6366F1"}}>.</span></div>
        <div style={styles.navLinks}>
          <button style={styles.textBtn} onClick={() => setView("login")}>Sign in</button>
          <button style={styles.primaryBtnSmall} onClick={() => setView("signup")}>Get started</button>
        </div>
      </header>

      <main style={styles.mainContent}>
        <div style={styles.heroGrid}>
          <div style={styles.heroTextContainer}>
            <div style={styles.subTag}>SECURE PRIVATE ROOM</div>
            <h1 style={styles.mainTitle}>
              Conversations,<br />
              <span style={{ color: "#818CF8" }}>unhurried & private.</span>
            </h1>
            <p style={styles.description}>
              An invite-controlled, noise-free chat room built for people who value genuine communication. No ads, no tracking, pure interaction.
            </p>
            <div style={styles.ctaGroup}>
              <button style={styles.primaryBtnLarge} onClick={() => setView("signup")}>
                Request an account &nbsp; →
              </button>
              <button style={styles.textLinkBtn} onClick={() => setView("login")}>
                I already have one
              </button>
            </div>
          </div>

          <div style={styles.previewCard}>
            <div style={styles.chatHeader}>
              <div style={styles.avatarMini}>AS</div>
              <div>
                <div style={{ fontWeight: "600", fontSize: "14px", color: "#F8FAFC" }}>Ananya S.</div>
                <div style={{ fontSize: "11px", color: "#34D399", fontWeight: "600" }}>● online</div>
              </div>
            </div>
            <div style={styles.chatBody}>
              <div style={styles.msgLeft}>Kal shaam free ho?</div>
              <div style={styles.msgRight}>Bilkul. Coffee ke liye milte hain.</div>
              <div style={styles.msgLeft}>Perfect! 6 baje milte hain.</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  pageWrapper: { backgroundColor: "#090A0F", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif", color: "#F8FAFC", paddingBottom: "80px", overflowX: "hidden" },
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 32px", maxWidth: "1100px", margin: "0 auto", boxSizing: "border-box" },
  logo: { fontSize: "22px", fontWeight: "800", color: "#F8FAFC", cursor: "pointer", letterSpacing: "-0.5px" },
  navLinks: { display: "flex", alignItems: "center", gap: "16px" },
  textBtn: { background: "none", border: "none", color: "#94A3B8", fontSize: "14px", cursor: "pointer", fontWeight: "500" },
  primaryBtnSmall: {
    background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)", color: "#FFFFFF", border: "none",
    borderRadius: "10px", padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
  },
  mainContent: { maxWidth: "1100px", margin: "60px auto 0", padding: "0 24px", boxSizing: "border-box" },
  heroGrid: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "50px" },
  heroTextContainer: { flex: "1 1 450px", maxWidth: "560px" },
  subTag: { fontSize: "11px", letterSpacing: "1.5px", color: "#818CF8", fontWeight: "700", textTransform: "uppercase", marginBottom: "16px" },
  mainTitle: { fontSize: "clamp(36px, 5vw, 54px)", lineHeight: "1.1", fontWeight: "800", color: "#F8FAFC", margin: "0 0 20px 0", letterSpacing: "-1px" },
  description: { fontSize: "16px", lineHeight: "1.6", color: "#94A3B8", margin: "0 0 32px 0" },
  ctaGroup: { display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" },
  primaryBtnLarge: {
    background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)", color: "#FFFFFF", border: "none",
    borderRadius: "14px", padding: "16px 28px", fontSize: "15px", fontWeight: "600", cursor: "pointer",
    boxShadow: "0 8px 20px rgba(99, 102, 241, 0.4)",
  },
  textLinkBtn: { background: "none", border: "none", color: "#F8FAFC", fontSize: "15px", cursor: "pointer", fontWeight: "500", textDecoration: "underline" },
  previewCard: {
    flex: "1 1 340px", maxWidth: "420px", width: "100%", backgroundColor: "#131825", borderRadius: "24px",
    padding: "24px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)", border: "1px solid #1E293B", boxSizing: "border-box",
  },
  chatHeader: { display: "flex", alignItems: "center", gap: "12px", paddingBottom: "16px", borderBottom: "1px solid #1E293B", marginBottom: "16px" },
  avatarMini: { width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px" },
  chatBody: { display: "flex", flexDirection: "column", gap: "12px" },
  msgLeft: { backgroundColor: "#1E293B", color: "#F8FAFC", padding: "10px 16px", borderRadius: "14px", borderBottomLeftRadius: "4px", alignSelf: "flex-start", maxWidth: "80%", fontSize: "13px" },
  msgRight: { background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)", color: "#FFFFFF", padding: "10px 16px", borderRadius: "14px", borderBottomRightRadius: "4px", alignSelf: "flex-end", maxWidth: "80%", fontSize: "13px" },
  navBtnAlt: { padding: "8px 14px", backgroundColor: "#131825", border: "1px solid #334155", borderRadius: "10px", color: "#F8FAFC", cursor: "pointer", fontSize: "13px", fontWeight: "500" },
  navBtnPrimary: { padding: "8px 16px", background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
};
