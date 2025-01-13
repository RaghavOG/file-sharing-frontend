/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Lock, CloudUpload, Clock, Copy } from 'lucide-react';

export const Home = () => {
    return (
      <div className="min-h-screen bg-[#2CBBC1]  flex flex-col">
        <Navbar />
        <main className="flex flex-col items-center justify-center flex-1 px-4 py-12">
          <h1 className="text-6xl font-bold text-center mb-8 text-white">Welcome to ClouDrop</h1>
          <p className="text-xl text-center max-w-2xl mb-12 text-white">
            ClouDrop lets you share files effortlessly. Upload, generate short links, and share with ease. Start by uploading a file or downloading one using a short file ID.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <FeatureCard 
              icon={<Lock className="w-10 h-10 text-[#2CBBC1]" />}
              title="Password Protection"
              description="Secure your files with optional password protection for added privacy."
            />
            <FeatureCard 
              icon={<CloudUpload className="w-10 h-10 text-[#2CBBC1]" />}
              title="Quick Uploads"
              description="Upload files up to 10MB for swift and convenient sharing."
            />
            <FeatureCard 
              icon={<Clock className="w-10 h-10 text-[#2CBBC1]" />}
              title="24-Hour Availability"
              description="Files automatically expire after 24 hours, ensuring your privacy."
            />
            <FeatureCard 
              icon={<Copy className="w-10 h-10 text-[#2CBBC1]" />}
              title="Easy Sharing"
              description="Copy and save your file ID for quick access and sharing."
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/upload">
              <Button className="w-full sm:w-auto bg-[#2CBBC1] hover:bg-[#25a0a5] text-white px-8 py-4 text-lg font-semibold rounded-full transition-colors duration-200 shadow-lg">
                Upload a File
              </Button>
            </Link>
            <Link to="/download">
              <Button className="w-full sm:w-auto bg-white hover:bg-gray-100 text-[#2CBBC1] px-8 py-4 text-lg font-semibold rounded-full transition-colors duration-200 shadow-lg">
                Download a File
              </Button>
            </Link>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  };

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-lg p-6 flex flex-col items-center text-center transition-transform duration-200 hover:scale-105 shadow-xl">
    <div className="bg-gray-100 p-3 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mt-2 mb-2 text-gray-800">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default Home;

