import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UserUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "", 
    role: "user",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/user/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        setFormData({ username: data.username, email: data.email, password: "", role: data.role });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = { ...formData };
    if (!updateData.password) delete updateData.password; 

    try {
      const res = await fetch(`http://localhost:3000/admin/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("User updated successfully!");
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-400 text-center mt-10">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Update User</h1>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              name="username"
              className="w-full p-3 bg-gray-700 rounded-md text-white focus:outline-none"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-3 bg-gray-700 rounded-md text-white focus:outline-none"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password (Leave empty to keep current)</label>
            <input
              type="password"
              name="password"
              className="w-full p-3 bg-gray-700 rounded-md text-white focus:outline-none"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Role</label>
            <select
              name="role"
              className="w-full p-3 bg-gray-700 rounded-md text-white focus:outline-none"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition"
          >
            Update User
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserUpdate;