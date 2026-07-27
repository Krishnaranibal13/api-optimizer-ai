import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../auth/AuthContext";
import { FaLock, FaSignInAlt, FaExclamationCircle } from "react-icons/fa";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Check for message from protected route or Connect API click
    const promptMessage = location.state?.message;
    const redirectTarget = location.state?.from || "/dashboard";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new URLSearchParams();
            formData.append("email", email);
            formData.append("password", password);

            const response = await API.post(
                "/auth/login",
                formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            // Save user and JWT using AuthContext
            login(
                response.data.user,
                response.data.access_token
            );

            // Redirect to target or dashboard
            navigate(redirectTarget);

        } catch (error) {
            console.error("Login Error:", error);
            if (error.response) {
                alert(error.response.data.detail || "Invalid email or password");
            } else {
                alert("Unable to connect to the server.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "radial-gradient(at 0% 0%, rgba(168, 85, 247, 0.28) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(236, 72, 153, 0.22) 0px, transparent 50%), #080413",
                color: "#f8fafc",
                padding: "20px"
            }}
        >
            <div
                style={{
                    width: "400px",
                    maxWidth: "100%",
                    backgroundColor: "rgba(19, 14, 38, 0.9)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "24px",
                    border: "1px solid rgba(192, 132, 252, 0.3)",
                    padding: "36px",
                    boxShadow: "0 20px 45px rgba(168, 85, 247, 0.25)"
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "28px" }}>
                    <div style={{ fontSize: "36px", marginBottom: "8px" }}>🚀</div>
                    <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#faf5ff", margin: 0 }}>Log In to API Optimizer</h2>
                    <p style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "6px" }}>
                        Enter your credentials to manage connected APIs
                    </p>
                </div>

                {promptMessage && (
                    <div
                        style={{
                            padding: "14px 16px",
                            backgroundColor: "rgba(245, 158, 11, 0.15)",
                            border: "1px solid #f59e0b",
                            color: "#fbbf24",
                            borderRadius: "14px",
                            marginBottom: "24px",
                            fontSize: "13px",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}
                    >
                        <FaExclamationCircle style={{ fontSize: "18px", flexShrink: 0, color: "#f59e0b" }} />
                        <span>{promptMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "bold", color: "#e2e8f0", display: "block", marginBottom: "8px" }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                borderRadius: "12px",
                                border: "1px solid rgba(192, 132, 252, 0.3)",
                                backgroundColor: "rgba(30, 22, 58, 0.9)",
                                color: "#ffffff",
                                outline: "none",
                                fontSize: "14px",
                                boxSizing: "border-box"
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "bold", color: "#e2e8f0", display: "block", marginBottom: "8px" }}>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                borderRadius: "12px",
                                border: "1px solid rgba(192, 132, 252, 0.3)",
                                backgroundColor: "rgba(30, 22, 58, 0.9)",
                                color: "#ffffff",
                                outline: "none",
                                fontSize: "14px",
                                boxSizing: "border-box"
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            backgroundColor: "#7c3aed",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "30px",
                            fontWeight: "bold",
                            fontSize: "15px",
                            cursor: "pointer",
                            boxShadow: "0 8px 25px rgba(124, 58, 237, 0.4)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        <FaSignInAlt /> {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>

                <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#cbd5e1" }}>
                    Don't have an account?{" "}
                    <Link to="/register" state={{ from: redirectTarget, message: promptMessage }} style={{ color: "#e879f9", fontWeight: "bold", textDecoration: "none" }}>
                        Register Now
                    </Link>
                </div>
                
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                    <Link to="/dashboard" style={{ color: "#94a3b8", fontSize: "13px", textDecoration: "none" }}>
                        ← Return to Public Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;