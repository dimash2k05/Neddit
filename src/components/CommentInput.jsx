import { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";

const CommentInput = ({ postId, onCommentAdded }) => {
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user?._id) {
      setError("You must be logged in to comment");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:3000/post/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText, userId: user._id }),
      });

      if (!res.ok) throw new Error("Failed to add comment");

      const newComment = await res.json();
      onCommentAdded(newComment.comment); 
      setCommentText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }

    window.location.reload();
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none bg-gray-100 text-gray-800 placeholder-gray-500"
        rows="3"
        placeholder="Add a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        ></textarea>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-pink-600 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-pink-700 transition"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Comment"}
        </button>
      </form>
    </div>
  );
};

export default CommentInput;
