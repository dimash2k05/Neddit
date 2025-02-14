import { useState } from "react";

const PostForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    images: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const filePaths = Array.from(e.target.files).map((file) => file.name);
    setFormData({ ...formData, images: [...formData.images, ...filePaths] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-900 p-8 rounded-xl shadow-xl text-white w-full max-w-md mx-auto"
    >
      <div>
        <input
          type="text"
          name="title"
          required
          placeholder="Title"
          className="w-full p-3 border border-gray-500 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div>
        <textarea
          name="content"
          rows="4"
          placeholder="Body"
          className="w-full p-3 border border-gray-500 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={formData.content}
          onChange={handleChange}
        ></textarea>
      </div>

      <div>
        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full p-3 border border-gray-500 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          onChange={handleFileChange}
        />
      </div>

      {formData.images.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Selected Images:</h3>
          <ul className="list-disc list-inside text-gray-300">
            {formData.images.map((img, index) => (
              <li key={index}>{img}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-lg text-lg font-bold transition"
      >
        Create Post
      </button>
    </form>
  );
};

export default PostForm;
