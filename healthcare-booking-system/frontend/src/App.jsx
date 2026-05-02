import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // --- SESSION ---
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    return (savedToken && savedToken !== "undefined") ? savedToken : null;
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return (savedUser && savedUser !== "undefined") ? JSON.parse(savedUser) : null;
    } catch (e) { return null; }
  });

  // --- DATA ---
  const [doctors, setDoctors] = useState([]);

  // --- BOOKING STATE ---
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  // --- AUTH/UI ---
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  // --- FETCH DOCTORS ---
  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/api/doctors')
        .then(res => setDoctors(res.data))
        .catch(err => console.log(err));
    }
  }, [token]);

  // --- AUTH ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const { data } = await axios.post(`http://localhost:5000${endpoint}`, formData);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

    } catch (err) {
      setNotification({ message: "Auth failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  // --- BOOKING ---
  const handleBooking = (doctorId) => {
    setSelectedDoctor(doctorId);
  };

  const confirmBooking = async () => {
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/appointments/book",
        {
          doctorId: selectedDoctor,
          appointmentDate: selectedDate
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("✅ Appointment Booked!");
      setSelectedDoctor(null);
      setSelectedDate("");

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("❌ Booking failed");
    }
  };

  // --- AUTH PAGE ---
  if (!token) {
    return (
      <div style={styles.authPage}>
        <div style={styles.authCard}>
          <h1>🏥 HealthPoint</h1>

          {notification.message && (
            <p style={{ color: 'red' }}>{notification.message}</p>
          )}

          <form onSubmit={handleAuth}>
            {!isLogin && (
              <input
                placeholder="Name"
                style={styles.input}
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            )}

            <input
              placeholder="Email"
              style={styles.input}
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              style={styles.input}
              required
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <button style={styles.primaryBtn}>
              {loading ? "Loading..." : (isLogin ? "Login" : "Register")}
            </button>
          </form>

          <p onClick={() => setIsLogin(!isLogin)} style={styles.toggleLink}>
            {isLogin ? "Create Account" : "Already have an account? Login"}
          </p>
        </div>
      </div>
    );
  }

  // --- DASHBOARD ---
  return (
    <div style={styles.mainContent}>
      
      {/* HEADER WITH LOGOUT */}
      <div style={styles.header}>
        <h1>Welcome, {user?.name}</h1>

        <button onClick={logout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {/* DOCTORS */}
      <div style={styles.sectionCard}>
        <h2>Available Doctors</h2>

        {doctors.length === 0 ? (
          <p>No doctors available</p>
        ) : (
          doctors.map(doc => (
            <div key={doc._id} style={styles.doctorCard}>
              <h3>{doc.name}</h3>
              <p>{doc.specialization}</p>

              <button
                style={styles.bookBtn}
                onClick={() => handleBooking(doc._id)}
              >
                Book Appointment
              </button>
            </div>
          ))
        )}
      </div>

      {/* BOOKING UI */}
      {selectedDoctor && (
        <div style={styles.sectionCard}>
          <h3>Select Date</h3>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={styles.input}
          />

          <button onClick={confirmBooking} style={styles.bookBtn}>
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}

// --- STYLES ---
const styles = {
  authPage: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  authCard: { padding: '30px', background: '#fff' },
  input: { display: 'block', margin: '10px 0', padding: '10px' },
  primaryBtn: { padding: '10px', background: '#007bff', color: '#fff' },
  toggleLink: { cursor: 'pointer', color: 'blue' },

  mainContent: { padding: '20px' },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  logoutBtn: {
    background: "red",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },

  sectionCard: { marginTop: '20px', padding: '20px', background: '#fff' },

  doctorCard: { marginBottom: '10px' },

  bookBtn: {
    background: '#007bff',
    color: '#fff',
    padding: '6px 12px',
    border: 'none'
  }
};

export default App;