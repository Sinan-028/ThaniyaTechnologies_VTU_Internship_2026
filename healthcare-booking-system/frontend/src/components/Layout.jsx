import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <span className="text-2xl">🏥</span>
          <h1 className="text-lg font-bold text-blue-600">HealthPoint</h1>
        </div>

        <div className="flex gap-6 text-sm items-center">
          <button onClick={() => navigate("/dashboard")} className="hover:text-blue-600">Home</button>
          <button onClick={() => navigate("/doctors")} className="hover:text-blue-600">Doctors</button>
          <button onClick={() => navigate("/appointments")} className="hover:text-blue-600">Appointments</button>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
            Logout
          </button>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="p-6">
        {children}
      </main>

    </div>
  );
};

export default Layout;