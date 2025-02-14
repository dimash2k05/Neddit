import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import EditPostModal from "../components/EditPostModal";
import CommentList from "../components/CommentList";
import CommentInput from "../components/CommentInput";
import { AuthContext } from "../AuthContext";

const ViewPost = () => {
  const { user, isLoggedIn } = useContext(AuthContext);
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:3000/post/${postId}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        setPost(data.post);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`http://localhost:3000/post/delete/${postId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      alert("Post deleted successfully!");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const addNewComment = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  if (loading) return <div className="text-center mt-10 text-xl font-semibold">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10 text-xl">{error}</div>;
  if (!post) return <div className="text-gray-500 text-center mt-10 text-xl">Post not found.</div>;

  return (
    <div className="min-h-screen w-screen bg-gray-100 flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} />

      <div className="flex-grow flex items-center justify-center p-10">
        <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden p-8">
          <Carousel images={post.images || []} />

          <div className="mt-6">
            <h2 className="text-3xl font-bold text-gray-900">{post.title}</h2>
            <p className="text-gray-700 mt-4 text-lg leading-relaxed">{post.content}</p>

            <div className="mt-6 text-gray-600 text-lg">
              <p><strong>Author:</strong> {post.author?.username || "Unknown"}</p>
              <p><strong>Created At:</strong> {new Date(post.createdAt).toLocaleString()}</p>
            </div>

            {isLoggedIn && user?._id === post.author?._id && (
              <div className="flex justify-end gap-4 mt-6">
                <button 
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-700 transition"
                  onClick={() => setShowEditModal(true)}
                >
                  Edit
                </button>
                <button 
                  className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <CommentList postId={post._id} />
          {isLoggedIn && <CommentInput postId={post._id} onCommentAdded={addNewComment} />}
        </div>
      </div>

      {showEditModal && (
        <EditPostModal 
            post={post} 
            onClose={() => setShowEditModal(false)} 
            onUpdate={(updatedPost) => setPost(updatedPost)} 
        />
        )}
    </div>
  );
};

export default ViewPost;