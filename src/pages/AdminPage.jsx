import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import UserUpdate from "../components/UserUpdate";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/admin/");
        const data = await res.json();
        setUsers(data.users);
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`http://localhost:3000/admin/delete/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        alert("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdate = (userId, updatedData) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user._id === userId ? { ...user, ...updatedData } : user))
    );
  };

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

          {loading && <p className="text-center text-gray-400">Loading users...</p>}
          {error && <p className="text-center text-red-400">{error}</p>}

          {!loading && !error && users.length > 0 ? (
            <ul className="divide-y divide-gray-700">
              {users.map((user) => (
                <li key={user._id} className="flex justify-between items-center py-3">
                  <div>
                    <span className="font-semibold text-lg">{user.username}</span>
                    <span className="ml-3 text-sm text-gray-400">({user.role})</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-white text-sm"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-white text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            !loading && <p className="text-center text-gray-400">No users found.</p>
          )}
        </div>
      </div>

      {selectedUser && (
        <UserUpdate
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default AdminPage;