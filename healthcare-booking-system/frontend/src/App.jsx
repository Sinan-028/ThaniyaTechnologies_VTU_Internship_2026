import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // --- 1. STRICT SESSION MANAGEMENT ---
  // We use a function to initialize state so it checks storage ONLY once on load
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

  // --- 2. AUTH & UI STATE ---
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  // Clear notifications
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => setNotification({ message: "", type: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ message: "", type: "" });
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const { data } = await axios.post(`http://localhost:5000${endpoint}`, formData);
      
      // Update browser storage IMMEDIATELY
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update state to swap the view from Auth to Home
      setToken(data.token);
      setUser(data.user);

      if (!isLogin) {
        setNotification({ message: "🎉 Account created successfully!", type: "success" });
      }
    } catch (err) {
      setNotification({ 
        message: err.response?.data?.message || "Auth failed. Check server connection.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsLogin(true); // Reset to login view for next person
  };

  // --- 3. THE "GATEKEEPER" VIEW (STRICT LOGIN/SIGNUP) ---
  // If there is NO token, the app STOPS here. The Home page code below is never reached.
  if (!token) {
    return (
      <div style={styles.authPage}>
        <div style={styles.authCard}>
          <h1 style={styles.brandTitle}>🏥 HealthPoint</h1>
          <p style={{color: '#64748b', marginBottom: '20px', fontWeight: '500'}}>
            {isLogin ? "Sign in to access your patient portal" : "Join our worldwide healthcare network"}
          </p>

          {notification.message && (
            <div style={notification.type === 'error' ? styles.errBanner : styles.successBanner}>
              {notification.message}
            </div>
          )}

          <form onSubmit={handleAuth}>
            {!isLogin && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input type="text" placeholder="John Doe" style={styles.input} required
                  onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
            )}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input type="email" placeholder="name@example.com" style={styles.input} required
                onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={{position: 'relative'}}>
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" style={styles.input} required
                  onChange={(e) => setFormData({...formData, password: e.target.value})} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} style={styles.primaryBtn}>
              {loading ? "Verifying..." : (isLogin ? "Sign In" : "Create Account")}
            </button>
          </form>

          <p style={styles.toggleFooter}>
            {isLogin ? "New user?" : "Already have an account?"} 
            <span onClick={() => { setIsLogin(!isLogin); setNotification({message: "", type: ""}); }} style={styles.toggleLink}>
              {isLogin ? " Register Now" : " Log in"}
            </span>
          </p>
        </div>
      </div>
    );
  }

  // --- 4. THE FULL DASHBOARD VIEW (ONLY REACHABLE AFTER LOGIN) ---
  return (
    <div style={styles.dashboardLayout}>
      <aside style={styles.sidebar}>
        <div>
          <h2 style={styles.logo}>🏥 HealthPoint</h2>
          <nav style={styles.sideNav}>
            <div style={styles.navItemActive}>🏠 Overview</div>
            <div style={styles.navItem}>📅 My Appointments</div>
            <div style={styles.navItem}>👨‍⚕️ Find a Doctor</div>
            <div style={styles.navItem}>📂 Health Records</div>
            <div style={styles.navItem}>💬 Messages</div>
          </nav>
        </div>
        <button onClick={logout} style={styles.logoutBtn}>Sign Out</button>
      </aside>

      <main style={styles.mainContent}>
        <header style={styles.dashHeader}>
          <div style={styles.welcomeContainer}>
            <h1 style={styles.welcomeHeading}>
              Welcome back, <span style={styles.userName}>{user?.name}</span>! 👋
            </h1>
            <p style={styles.welcomeSubtext}>You have 2 scheduled appointments for this month.</p>
          </div>
          <button style={styles.actionBtn}>+ Book Appointment</button>
        </header>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}><h3>2</h3><p>Upcoming</p></div>
          <div style={styles.statCard}><h3>14</h3><p>Total Visits</p></div>
          <div style={styles.statCard}><h3>5</h3><p>Prescriptions</p></div>
          <div style={styles.statCard}><h3>0</h3><p>New Alerts</p></div>
        </div>

        <div style={styles.contentGrid}>
          <section style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <h3>Next Appointment</h3>
              <span style={styles.viewAll}>View All</span>
            </div>
            <div style={styles.appointmentDetail}>
              <div style={styles.dateBox}>
                <span style={{fontSize: '11px', color: '#64748b'}}>MAY</span>
                <span style={{fontSize: '18px', fontWeight: 'bold'}}>15</span>
              </div>
              <div style={styles.infoBox}>
                <h4 style={{margin: 0}}>Dr. Sarah Johnson</h4>
                <p style={{margin: '4px 0', fontSize: '13px', color: '#64748b'}}>Cardiology • 10:30 AM</p>
              </div>
              <span style={styles.statusBadge}>Confirmed</span>
            </div>
          </section>

          <section style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <h3>Recent Lab Results</h3>
            </div>
            <div style={styles.resultItem}>
              <span>Blood Report</span>
              <strong style={{color: '#16a34a'}}>Normal</strong>
            </div>
            <div style={styles.resultItem}>
              <span>Cholesterol</span>
              <strong style={{color: '#f59e0b'}}>Pending</strong>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// --- PROFESSIONAL MERN DESIGN STYLES ---
const styles = {
  authPage: { background: '#f1f5f9', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter", sans-serif' },
  authCard: { background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '400px', textAlign: 'center' },
  brandTitle: { color: '#0f172a', margin: '0 0 10px 0', fontSize: '28px' },
  inputGroup: { textAlign: 'left', marginBottom: '16px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#334155' },
  input: { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', boxSizing: 'border-box', outline: 'none', fontSize: '15px' },
  primaryBtn: { width: '100%', padding: '14px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  eyeBtn: { position: 'absolute', right: '12px', top: '10px', background: 'none', border: 'none', cursor: 'pointer' },
  errBanner: { background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' },
  successBanner: { background: '#f0fdf4', color: '#16a34a', padding: '10px', borderRadius: '12px', marginBottom: '16px', fontSize: '13px' },
  toggleFooter: { marginTop: '20px', fontSize: '14px', color: '#64748b' },
  toggleLink: { color: '#007bff', fontWeight: 'bold', cursor: 'pointer' },
  
  dashboardLayout: { display: 'flex', height: '100vh', fontFamily: '"Inter", sans-serif' },
  sidebar: { width: '260px', borderRight: '1px solid #e2e8f0', padding: '30px', display: 'flex', flexDirection: 'column', background: '#fff' },
  logo: { color: '#007bff', marginBottom: '40px', fontSize: '22px' },
  sideNav: { flex: 1 },
  navItemActive: { color: '#007bff', fontWeight: 'bold', padding: '12px 16px', background: '#eff6ff', borderRadius: '10px', marginBottom: '8px' },
  navItem: { color: '#64748b', padding: '12px 16px', cursor: 'pointer', marginBottom: '8px' },
  logoutBtn: { background: '#fee2e2', color: '#dc2626', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  
  mainContent: { flex: 1, padding: '40px', background: '#f8fafc', overflowY: 'auto' },
  dashHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  
  welcomeContainer: { textAlign: 'left' },
  welcomeHeading: { fontSize: '28px', color: '#0f172a', margin: 0, fontWeight: '700' },
  userName: { color: '#007bff', marginLeft: '6px', marginRight: '2px' }, 
  welcomeSubtext: { color: '#64748b', marginTop: '6px', fontSize: '16px' },

  actionBtn: { background: '#007bff', color: '#fff', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' },
  statCard: { background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', textAlign: 'center' },
  contentGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' },
  sectionCard: { background: '#fff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  appointmentDetail: { display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '16px', borderRadius: '12px' },
  dateBox: { background: '#fff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '16px' },
  infoBox: { flex: 1 },
  statusBadge: { background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' },
  resultItem: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' },
  viewAll: { color: '#007bff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }
};

export default App;