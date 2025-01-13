import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full bg-[#2CBBC1] backdrop-blur-md border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold">
              <img src="./cloudrop-logo-removebg-preview.png" alt="Cloudrop Logo" width={300} className="max-h-12 w-auto" />
            </Link>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link to="/upload">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200">
                Upload
              </Button>
            </Link>
            <Link to="/download">
              <Button className="bg-green-600 hover:bg-green-700 text-white transition-colors duration-200">
                Download
              </Button>
            </Link>
          </div>
          <div className="md:hidden">
            <Button onClick={toggleMenu} variant="ghost" className="text-white hover:bg-[#25a0a5]">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/upload">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white mb-2 transition-colors duration-200">
                Upload
              </Button>
            </Link>
            <Link to="/download">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-200">
                Download
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

