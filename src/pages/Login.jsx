import React, { useState } from "react";

export default function Login({ onLogin, onSwitchToSignup, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await onLogin(email, password, (err) => {
      if (err) setError(err);
      setLoading(false);
    });
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalCard}>
        <button style={styles.closeBtn} onClick={onBack}>✕</button>
        <div style={styles.badge}>WELCOME BACK</div>
        <h2 style={styles.title}>Sign In to Room</h2>
        <p style={styles.subtitle}>Access your secure messages and chat channels.</p>

        {error && <div style={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.primaryBtn} disabled={loading}>
            {loading ? "Authenticating..." : "Sign In →"}
          </button>
        </form>

        <div style={styles.footerText}>
          Don't have an account?{" "}
          <span style={styles.link} onClick={onSwitchToSignup}>Request access</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(5, 7, 12, 0.8)", backdropFilter: "blur(12px)",
    display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "16px",
  },
  modalCard: {
    backgroundColor: "#131825", borderRadius: "24px", padding: "36px", width: "100%", maxWidth: "420px",
    position: "relative", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)", border: "1px solid #1E293B", boxSizing: "border-box",
  },
  closeBtn: {
    position: "absolute", top: "20px", right: "20px", background: "rgba(255,255,255,0.05)", border: "none",
    width: "32px", height: "32px", borderRadius: "50%", fontSize: "14px", cursor: "pointer", color: "#94A3B8",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  badge: {
    fontSize: "11px", letterSpacing: "1.5px", color: "#818CF8", fontWeight: "700", marginBottom: "8px", textTransform: "uppercase",
  },
  title: { fontSize: "24px", fontWeight: "700", color: "#F8FAFC", margin: "0 0 6px 0" },
  subtitle: { color: "#94A3B8", fontSize: "14px", marginBottom: "24px" },
  inputGroup: { marginBottom: "16px", textAlign: "left" },
  label: { display: "block", fontSize: "12px", fontWeight: "600", color: "#94A3B8", marginBottom: "6px" },
  input: {
    width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #334155",
    backgroundColor: "#0B0F19", color: "#F8FAFC", boxSizing: "border-box", fontSize: "14px", outline: "none",
  },
  primaryBtn: {
    width: "100%", padding: "14px", background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
    color: "#FFF", border: "none", borderRadius: "12px", fontWeight: "600", fontSize: "15px", cursor: "pointer",
    marginTop: "8px", boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
  },
  footerText: { marginTop: "20px", textAlign: "center", fontSize: "13px", color: "#94A3B8" },
  link: { color: "#818CF8", fontWeight: "600", cursor: "pointer", textDecoration: "underline" },
  errorMsg: { backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#F87171", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" },
};
