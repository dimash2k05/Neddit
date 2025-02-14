import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.posts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-900 text-white">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-[1400px] mx-auto px-6 py-10">
        <h1 className="text-5xl font-bold text-white-500 text-center mb-10">
          Latest Posts
        </h1>

        {loading ? (
          <p className="text-gray-300 text-center">Loading posts...</p>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full justify-center">
            {[...posts].reverse().map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;