import React from "react";
import { useParams, Link } from "react-router-dom";

const ErrorPage = ({ errorCode, errorMessage }) => {
  const params = useParams();
  const finalErrorCode = errorCode || params.errorCode || "404";
  const finalErrorMessage = errorMessage || "Oops... Something went wrong!";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <nav className="w-full bg-transparent p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Neddit</Link>
        </div>
      </nav>

      <div className="flex flex-col items-center text-center">
        <h1 className="text-6xl font-bold">{finalErrorCode}</h1>
        <h4 className="text-2xl mt-2">Oops...!</h4>
        <p className="text-lg">{finalErrorMessage}</p>
      </div>
    </div>
  );
};

export default ErrorPage;