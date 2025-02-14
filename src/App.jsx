import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Error from "./pages/Error";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreatePost from "./pages/CreatePost";
import ViewPost from "./pages/ViewPost";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/post/create" element={<CreatePost />} />
        <Route path="/post/:postId" element={<ViewPost />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profile" element={<ProfilePage /> } />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
};

export default App;