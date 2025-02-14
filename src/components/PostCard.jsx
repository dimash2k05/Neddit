import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  const imageUrls = Array.isArray(post.images) && post.images.length > 0 ? post.images : [];

  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition hover:scale-105 hover:shadow-2xl w-[350px]">
      <div className="relative w-full h-64 bg-gray-700">
        {imageUrls.length > 0 ? (
          <img
            src={`http://localhost:3000/uploads/${imageUrls[0]}`}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="p-6">
        <h5 className="text-2xl font-semibold">{post.title}</h5>
        <p className="text-gray-400 mt-2">
          {post.content.length > 140 ? post.content.slice(0, 140) + "..." : post.content}
        </p>
        <p className="text-sm text-gray-500 mt-3">
          <strong>Author:</strong> {post.author?.username || "Unknown"}
        </p>
        <Link
          to={`/post/${post._id}`}
          className="block mt-4 bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-lg text-center transition"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostCard;