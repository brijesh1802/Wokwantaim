import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin } from "lucide-react";
Logo.png;
import Logo from "../assets/Logo.png";

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container flex items-center justify-between px-4 py-4 mx-auto">
        <div className="flex items-center space-x-6">
          <img src={Logo} alt="Logo" className="h-8" />
          <Link to="/" className="text-xl font-medium text-orange-500">
            Home
          </Link>
          <Link to="/jobs" className="text-gray-600 hover:text-orange-500">
            Job List
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <Link
              to="/signup"
              className="px-4 py-2 text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600"
            >
              Sign Up
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link
              to="/login"
              className="px-4 py-2 text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600"
            >
              Login
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-600 hover:text-orange-500">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-orange-500">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-orange-500">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
