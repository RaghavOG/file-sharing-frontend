import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';

export const Home = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600 flex flex-col items-center justify-center text-white">
        <Navbar />
        <main className="flex flex-col items-center justify-center flex-1 px-4">
          <h1 className="text-5xl font-bold text-center mb-8">Welcome to FileShare</h1>
          <p className="text-lg text-center max-w-2xl mb-12">
            FileShare allows you to upload files, generate short links, and share them with ease. Get started by uploading a file or downloading one using a short file ID.
          </p>
          <div className="flex space-x-4">
            <Link to="/upload">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 text-lg">
                Upload a File
              </Button>
            </Link>
            <Link to="/download">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg">
                Download a File
              </Button>
            </Link>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  };