/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { DownloadIcon, RefreshCw, AlertCircle, UploadIcon, CheckCircle, FileIcon, Lock } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';

const Download = () => {
  const [fileId, setFileId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileNotFound, setFileNotFound] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [password, setPassword] = useState('');
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const [passwordAttempts, setPasswordAttempts] = useState(0);
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setFileId(id);
      checkFileStatus(id);
    }
  }, [id]);

  const checkFileStatus = async (fileId) => {
    setIsLoading(true);
    setFileNotFound(false);
    setFileInfo(null);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/files/${fileId}`);
      
      if (response.data.success) {
        setFileInfo(response.data);
        if (!response.data.isPasswordProtected) {
          handleDownload(fileId);
        }
      }
    } catch (error) {
      setFileNotFound(true);
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast({ title: 'Failed to fetch file', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (id, pwd = null) => {
    setIsCheckingPassword(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/download`, { 
        id,
        password: pwd 
      });

      if (response.data.success) {
        setDownloadUrl(response.data.url);
        toast({ title: 'File ready for download!', variant: 'success' });
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setPasswordAttempts(prev => prev + 1);
        toast({ 
          title: 'Incorrect password', 
          description: error.response.data.message,
          variant: 'destructive' 
        });
      } else {
        toast({ 
          title: 'Download failed', 
          description: error.response?.data?.message || 'An error occurred',
          variant: 'destructive' 
        });
      }
    } finally {
      setIsCheckingPassword(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      toast({ title: 'Please enter the password', variant: 'destructive' });
      return;
    }
    handleDownload(fileId, password);
  };

  const handleInputChange = (e) => {
    setFileId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fileId) {
      navigate(`/download/${fileId}`);
    } else {
      toast({ title: 'Please enter a valid file ID', variant: 'destructive' });
    }
  };

  const resetDownload = () => {
    setDownloadUrl('');
    setFileId('');
    setPassword('');
    setFileInfo(null);
    setPasswordAttempts(0);
    navigate('/download');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md mx-4 bg-black/30 backdrop-blur-lg border border-purple-500/20 shadow-2xl rounded-xl overflow-hidden hover:border-purple-500/40 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />
          <CardHeader className="relative">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                File Download
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-6">
            {!fileInfo && !downloadUrl && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter file ID"
                  value={fileId}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white/5 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/50 rounded-lg transition-all duration-200"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 ease-in-out transform hover:scale-102 hover:shadow-lg hover:shadow-purple-500/20 rounded-lg"
                >
                  {isLoading ? (
                    <RefreshCw className="animate-spin mr-2" size={20} />
                  ) : (
                    <FileIcon className="mr-2" size={20} />
                  )}
                  Fetch File
                </Button>
              </form>
            )}

            {fileInfo && fileInfo.isPasswordProtected && !downloadUrl && (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-white bg-blue-500/10 p-4 rounded-lg backdrop-blur-sm border border-blue-500/20">
                  <Lock className="text-blue-400" size={24} />
                  <p className="font-medium">This file is password protected</p>
                </div>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-white/5 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/50 rounded-lg transition-all duration-200"
                  />
                  <Button
                    type="submit"
                    disabled={isCheckingPassword}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 ease-in-out transform hover:scale-102 hover:shadow-lg hover:shadow-purple-500/20 rounded-lg"
                  >
                    {isCheckingPassword ? (
                      <RefreshCw className="animate-spin mr-2" size={20} />
                    ) : (
                      <DownloadIcon className="mr-2" size={20} />
                    )}
                    Verify & Download
                  </Button>
                </form>
              </div>
            )}

            {isLoading && !fileInfo && !downloadUrl && (
              <div className="text-center">
                <RefreshCw className="animate-spin text-purple-400 mx-auto" size={24} />
                <p className="text-white/80 mt-2">Fetching file...</p>
              </div>
            )}

            {fileNotFound && (
              <div className="text-center text-red-400">
                <AlertCircle className="mx-auto animate-pulse" size={24} />
                <p className="mt-2">File not found or has expired. Please check the ID and try again.</p>
              </div>
            )}

            {downloadUrl && (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-white bg-green-500/10 p-4 rounded-lg backdrop-blur-sm animate-fade-in border border-green-500/20">
                  <CheckCircle className="text-green-400" size={24} />
                  <p className="font-semibold">File ready for download!</p>
                </div>
                
                <Button
                  onClick={() => window.location.href = downloadUrl}
                  className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-200 ease-in-out transform hover:scale-102 hover:shadow-lg hover:shadow-green-500/20 rounded-lg"
                >
                  <DownloadIcon className="mr-2" size={20} />
                  Download File
                </Button>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={resetDownload}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
                  >
                    Download Other File
                  </Button>
                  <Button
                    onClick={() => navigate('/upload')}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200"
                  >
                    <UploadIcon className="mr-2" size={20} />
                    Upload File
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Download;