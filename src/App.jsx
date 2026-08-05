import React, { useState } from "react";
import Chat from "./Chat";

export default function App() {
  const [view, setView] = useState("landing"); // 'landing', 'login', 'signup', 'pending', 'chat'
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [currentUser, setCurrentUser] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_URL = "https://chat-connect-frontend-s5tp.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e, isSignup) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

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
      // Fallback
      setCurrentUser(formData.username || "User");
      setView("chat");
    }
  };

  if (view === "chat") {
    return (
      <div style={{ backgroundColor: "#FAF8F5", minHeight: "100vh", padding: "20px 10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "600px", margin: "0 auto 15px" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: "bold", color: "#0F172A" }}>Conection.</span>
          <button 
            onClick={() => setView("landing")} 
            style={{ padding: "8px 18px", backgroundColor: "#0F172A", color: "#fff", border: "none", borderRadius: "20px", cursor: "pointer", fontSize: "13px", fontWeight: "500" }}
          >
            Logout
          </button>
        </div>
        <Chat username={currentUser} />
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      {/* Top Navbar */}
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

      {/* Login / Signup / Pending Modal */}
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

      {/* Main Responsive Landing Section */}
      <main style={styles.mainContent}>
        <div style={styles.heroGrid}>
          {/* Left Column: Heading & CTAs */}
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

          {/* Right Column: Interactive Preview Card */}
          <div style={styles.heroCardContainer}>
            <div style={styles.previewCard}>
              <div style={styles.chatHeader}>
                <div style={styles.avatar}>AS</div>
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

        {/* Features Grid (Horizontal on Laptop, Stacked on Mobile) */}
        <div style={styles.featuresGrid}>
          <div style={styles.featureItem}>
            <div style={styles.iconBox}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 style={styles.featureTitle}>Invite only</h3>
            <p style={styles.featureText}>
              Every new member is reviewed by the admin. Your room stays small, calm, and trusted.
            </p>
          </div>

          <div style={styles.featureItem}>
            <div style={styles.iconBox}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <h3 style={styles.featureTitle}>Find people, fast</h3>
            <p style={styles.featureText}>
              Search by name or email and open a conversation in a single click. No friends list drama.
            </p>
          </div>

          <div style={styles.featureItem}>
            <div style={styles.iconBox}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h3 style={styles.featureTitle}>Real-time, forever</h3>
            <p style={styles.featureText}>
              Messages arrive instantly and stay saved. Come back later — your history is exactly where you left it.
            </p>
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
    fontWeight: "500",
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
    marginBottom: "80px",
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
    marginBottom: "24px",
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
    flexWrap: "wrap",
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
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textLinkBtn: {
    background: "none",
    border: "none",
    color: "#0F172A",
    fontSize: "15px",
    cursor: "pointer",
    padding: "5px 0",
    textDecoration: "underline",
    fontWeight: "500",
  },
  previewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.07), 0 10px 15px -5px rgba(0, 0, 0, 0.03)",
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
  avatar: {
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
  featuresGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "40px",
    borderTop: "1px solid #E2E8F0",
    paddingTop: "60px",
    justifyContent: "space-between",
  },
  featureItem: {
    flex: "1 1 280px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  iconBox: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "1px solid #CBD5E1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "6px",
    backgroundColor: "#FFFFFF",
  },
  featureTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "22px",
    fontWeight: "normal",
    color: "#0F172A",
    margin: 0,
  },
  featureText: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#64748B",
    margin: 0,
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
