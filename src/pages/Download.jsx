import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {!downloadUrl && (
                <>
                  <Input
                    type="text"
                    placeholder="Enter file ID (numbers only)"
                    value={fileId}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white/5 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/50 rounded-lg transition-all duration-200"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 ease-in-out transform hover:scale-102 hover:shadow-lg hover:shadow-purple-500/20 rounded-lg"
                  >
                    <DownloadIcon className="mr-2" size={20} />
                    Fetch File
                  </Button>
                </>
              )}
            </form>

            {isLoading && (
              <div className="mt-4 text-center">
                <RefreshCw className="animate-spin text-purple-400 mx-auto" size={24} />
                <p className="text-white/80 mt-2">Fetching file...</p>
              </div>
            )}

            {fileNotFound && (
              <div className="mt-4 text-center text-red-400">
                <AlertCircle className="mx-auto animate-pulse" size={24} />
                <p className="mt-2">File not found. Please check the ID and try again.</p>
              </div>
            )}

            {downloadUrl && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-center space-x-2 text-white bg-green-500/10 p-4 rounded-lg backdrop-blur-sm animate-fade-in border border-green-500/20">
                  <CheckCircle className="text-green-400" size={24} />
                  <p className="font-semibold">File ID: {fileId}</p>
                </div>
                <div className="flex items-center justify-center space-x-2 text-white/90">
                  <FileIcon className="animate-pulse text-blue-400" size={24} />
                  <p>Your file is ready for download!</p>
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
                    onClick={() => {
                      setDownloadUrl('');
                      setFileId('');
                      navigate('/download');
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 ease-in-out transform hover:scale-102 hover:shadow-lg hover:shadow-blue-500/20 rounded-lg"
                  >
                    Download Other File
                  </Button>
                  <Button
                    onClick={() => navigate('/upload')}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 ease-in-out transform hover:scale-102 hover:shadow-lg hover:shadow-purple-500/20 rounded-lg"
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