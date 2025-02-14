import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import PostForm from "../components/PostForm";
import Navbar from "../components/Navbar";
import { AuthContext } from "../AuthContext";

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handlePostSubmit = async (formData) => {
    try {
      const response = await fetch("http://localhost:3000/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          images: formData.images,
          author: user,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error creating post");
      }

      const data = await response.json();
      alert("Post created successfully!");
      navigate(`/post/${data.post._id}`);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white flex flex-col">
      <Navbar />
      <div className="flex flex-grow items-center justify-center px-4">
        <div className="bg-gray-800 p-12 rounded-2xl shadow-2xl w-full max-w-3xl">
          <h1 className="text-5xl font-bold mb-8 text-center text-white">
            Create New Post
          </h1>
          <div className="flex justify-center">
            <PostForm onSubmit={handlePostSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;