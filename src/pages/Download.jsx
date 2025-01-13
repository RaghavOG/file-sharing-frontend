import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Navbar } from '../components/Navbar';
import { DownloadIcon, RefreshCw, AlertCircle, UploadIcon, CheckCircle, FileIcon } from 'lucide-react';

const Download = () => {
  const [fileId, setFileId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileNotFound, setFileNotFound] = useState(false);
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const numId = Number(id);
      if (!isNaN(numId)) {
        setFileId(numId.toString());
        handleDownload(numId);
      } else {
        toast({ title: 'Invalid file ID', description: 'File ID must be a number', variant: 'destructive' });
        navigate('/download');
      }
    }
  }, [id, navigate, toast]);

  const handleDownload = async (id) => {
    setIsLoading(true);
    setFileNotFound(false);
    console.log('Downloading file with ID:', id);

    if (!id) {
      toast({ title: 'File ID is missing', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/download`, { id });

      if (response.data.success) {
        setDownloadUrl(response.data.url);
        toast({ title: 'File ready for download!', variant: 'success' });
      } else {
        setFileNotFound(true);
        toast({ title: response.data.message || 'File not found', variant: 'destructive' });
      }
    } catch (error) {
      setFileNotFound(true);
      toast({ title: 'Failed to fetch file', description: error.response?.data?.message || 'An error occurred', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setFileId(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fileId) {
      navigate(`/download/${fileId}`);
    } else {
      toast({ title: 'Please enter a valid file ID', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black bg-opacity-30 backdrop-blur-md border border-gray-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">File Download</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!downloadUrl && (
                <>
                  <Input
                    type="text"
                    placeholder="Enter file ID (numbers only)"
                    value={fileId}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-transparent border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 ease-in-out transform hover:scale-105"
                  >
                    <DownloadIcon className="mr-2" size={20} />
                    Fetch File
                  </Button>
                </>
              )}
            </form>

            {isLoading && (
              <div className="mt-4 text-center">
                <RefreshCw className="animate-spin text-white mx-auto" size={24} />
                <p className="text-white mt-2">Fetching file...</p>
              </div>
            )}

            {fileNotFound && (
              <div className="mt-4 text-center text-red-500">
                <AlertCircle className="mx-auto" size={24} />
                <p className="mt-2">File not found. Please check the ID and try again.</p>
              </div>
            )}

            {downloadUrl && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-center space-x-2 text-white bg-green-600 bg-opacity-20 p-3 rounded-md animate-fade-in">
                  <CheckCircle className="text-green-500" size={24} />
                  <p className="font-semibold">File ID: {fileId}</p>
                </div>
                <div className="flex items-center justify-center space-x-2 text-white">
                  <FileIcon className="animate-pulse" size={24} />
                  <p>Your file is ready for download!</p>
                </div>
                <Button
                  onClick={() => window.location.href = downloadUrl}
                  className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                  <DownloadIcon className="mr-2" size={20} />
                  Download File
                </Button>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      setDownloadUrl('');
                      setFileId('');
                      navigate('/download');
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 ease-in-out transform hover:scale-105"
                  >
                    Download Other File
                  </Button>
                  <Button
                    onClick={() => navigate('/upload')}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 ease-in-out transform hover:scale-105"
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
    </div>
  );
};

export default Download;

