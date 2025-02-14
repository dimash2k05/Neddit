import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

const Navbar = () => {
    const { user, isLoggedIn, logout } = useContext(AuthContext);
    const isAdmin = isLoggedIn && user?.role === "admin";

    return (
        <nav className="bg-[#121212] p-4 shadow-lg shadow-black/50">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-3xl font-bold text-pink-500 hover:text-pink-400 transition">
                    Neddit
                </Link>

                <div className="flex items-center space-x-8 text-lg">
                    <Link to="/" className="text-white hover:text-pink-400 transition">Home</Link>
                    {isLoggedIn && (
                        <Link to="/post/create" className="text-white hover:text-pink-400 transition">Create</Link>
                    )}
                    {isAdmin && (
                        <Link to="/admin" className="text-yellow-400 hover:text-yellow-300 transition font-semibold">
                            Admin Page
                        </Link>
                    )}
                </div>

                <div className="flex items-center space-x-6">
                    {isLoggedIn ? (
                        <>
                            <Link 
                                to="/profile" 
                                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md transition"
                            >
                                Profile
                            </Link>
                            <button
                                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md transition"
                                onClick={logout}
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth/login" className="text-white hover:text-pink-400 transition">Login</Link>
                            <Link to="/auth/register" className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md transition">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
