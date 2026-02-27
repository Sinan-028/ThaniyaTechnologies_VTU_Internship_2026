import UserForm from "./UserForm";
import UserList from "./UserList";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>User Manager</h2>
      <UserForm />
      <UserList />
    </div>
  );
}

export default App;