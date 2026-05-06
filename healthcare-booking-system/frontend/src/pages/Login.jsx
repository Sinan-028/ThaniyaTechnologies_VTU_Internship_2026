import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    specialization: ""
  });

  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isLogin
        ? "/api/auth/login"
        : "/api/auth/register";

      //  Payload handling
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const { data } = await axios.post(
        `http://localhost:5000${endpoint}`,
        payload
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      //  Role-based redirect
      if (data.user.role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🏥 HealthPoint</h1>

        <h3 style={styles.subtitle}>
          {isLogin ? "Login to your account" : "Create a new account"}
        </h3>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleAuth} style={styles.form}>
          
          {/* NAME */}
          {!isLogin && (
            <input
              placeholder="Full Name"
              value={formData.name}
              required
              style={styles.input}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          )}

          {/* ROLE SELECT */}
          {!isLogin && (
            <select
              value={formData.role}
              style={styles.input}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          )}

          {/* SPECIALIZATION (ONLY FOR DOCTOR) */}
          {!isLogin && formData.role === "doctor" && (
            <input
              placeholder="Specialization (e.g. Cardiologist)"
              value={formData.specialization}
              required
              style={styles.input}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specialization: e.target.value
                })
              }
            />
          )}

          {/* EMAIL */}
          <input
            placeholder="Email"
            value={formData.email}
            required
            style={styles.input}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            required
            style={styles.input}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <button style={styles.button}>
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
          style={styles.switchText}
        >
          {isLogin
            ? "Don't have an account? Create one"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fa",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "320px",
    textAlign: "center",
  },

  title: {
    marginBottom: "10px",
    color: "#007bff",
  },

  subtitle: {
    marginBottom: "20px",
    fontWeight: "normal",
    color: "#555",
  },

  form: {
    display: "flex",
    flexDirection: "column",
  },

  input: {
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  button: {
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  error: {
    color: "red",
    marginBottom: "10px",
  },

  switchText: {
    marginTop: "15px",
    color: "#007bff",
    cursor: "pointer",
  },
};

export default Login;