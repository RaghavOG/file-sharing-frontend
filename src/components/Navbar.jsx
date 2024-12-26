import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";

export const Navbar = () => {
  return (
    <nav className="w-full bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600 backdrop-blur-md border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold">
              FileShare
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/upload">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Upload
              </Button>
            </Link>
            <Link to="/download">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Download
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};