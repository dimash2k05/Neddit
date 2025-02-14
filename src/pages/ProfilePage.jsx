import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

const ProfilePage = () => {
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData({ username: user.username, password: "" });
      fetchUserPosts();
    }
  }, [user, isLoggedIn]);

  const fetchUserPosts = async () => {
    try {
      const res = await fetch(`http://localhost:3000/post/user/${user._id}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/admin/update/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white flex flex-col">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-grow p-6 w-full">
        
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl mb-8">
          <h1 className="text-4xl font-bold text-white text-left w-full md:w-1/2">
            Hello, {user?.username}!
          </h1>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full md:w-1/2">
            <h2 className="text-2xl font-bold text-white mb-4">Update Profile</h2>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="username"
                className="w-full p-3 bg-gray-700 rounded-md"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                className="w-full p-3 bg-gray-700 rounded-md"
                placeholder="New password (optional)"
                value={formData.password}
                onChange={handleChange}
              />
              <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 py-2 rounded-md">
                Save Changes
              </button>
            </form>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-5xl">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Your Posts</h2>
          {loading ? (
            <p className="text-gray-300 text-center">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-400 text-center">No posts found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;