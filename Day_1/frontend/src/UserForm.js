import { useState } from "react";
import axios from "axios";

function UserForm() {
  const [name, setName] = useState("");

  const addUser = async () => {
    if (!name) return;
    await axios.post("http://localhost:5000/users", { name });
    setName("");
    window.location.reload();
  };

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={addUser}>Add</button>
    </div>
  );
}

export default UserForm;