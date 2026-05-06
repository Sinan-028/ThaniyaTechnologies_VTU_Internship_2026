import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUsers(res.data));
  }, []);

  return (
    <div>
      <h1>Admin Panel</h1>

      {users.map(user => (
        <p key={user._id}>
          {user.name} - {user.role}
        </p>
      ))}
    </div>
  );
};

export default AdminDashboard;