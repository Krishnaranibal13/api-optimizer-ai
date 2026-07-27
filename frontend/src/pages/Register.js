import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { FaUserPlus } from "react-icons/fa";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await API.post("/users/", {
                name,
                email,
                password,
            });

            alert("Registration Successful! Please log in.");
            navigate("/login");
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.detail || "Registration failed");
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
                background: "radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.3) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(6, 182, 212, 0.25) 0px, transparent 50%), #030712",
                color: "#f8fafc",
                padding: "20px"
            }}
        >
            <div
                style={{
                    width: "400px",
                    maxWidth: "100%",
                    backgroundColor: "rgba(11, 20, 42, 0.9)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "24px",
                    border: "1px solid rgba(56, 189, 248, 0.35)",
                    padding: "36px",
                    boxShadow: "0 20px 45px rgba(2, 132, 199, 0.3)"
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "28px" }}>
                    <div style={{ fontSize: "36px", marginBottom: "8px" }}>🚀</div>
                    <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#f0f9ff", margin: 0 }}>Create Account</h2>
                    <p style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "6px" }}>
                        Sign up to connect and optimize your REST APIs
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "bold", color: "#e2e8f0", display: "block", marginBottom: "8px" }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                borderRadius: "12px",
                                border: "1px solid rgba(56, 189, 248, 0.3)",
                                backgroundColor: "rgba(20, 36, 72, 0.9)",
                                color: "#ffffff",
                                outline: "none",
                                fontSize: "14px",
                                boxSizing: "border-box"
                            }}
                            required
                        />
                    </div>

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
                                border: "1px solid rgba(56, 189, 248, 0.3)",
                                backgroundColor: "rgba(20, 36, 72, 0.9)",
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
                                border: "1px solid rgba(56, 189, 248, 0.3)",
                                backgroundColor: "rgba(20, 36, 72, 0.9)",
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
                            backgroundColor: "#0284c7",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "30px",
                            fontWeight: "bold",
                            fontSize: "15px",
                            cursor: "pointer",
                            boxShadow: "0 8px 25px rgba(2, 132, 199, 0.4)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        <FaUserPlus /> {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#cbd5e1" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "#38bdf8", fontWeight: "bold", textDecoration: "none" }}>
                        Log In
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

export default Register;