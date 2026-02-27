import { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/users");
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/users/${id}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>
          {u.name}
          <button onClick={() => deleteUser(u.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default UserList;