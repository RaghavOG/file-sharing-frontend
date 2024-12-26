/* eslint-disable react-hooks/exhaustive-deps */
import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Navbar } from '@/components/Navbar';

const Download = () => {
  const [fileId, setFileId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setFileId(id);
      handleDownload(id);
    }
  }, [id]);

  const handleDownload = async (id) => {
    setIsLoading(true);
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
            // Backend indicates an error, such as file not found
            toast({ title: response.data.message || 'Failed to fetch file', variant: 'destructive' });
        }
    } catch (error) {
        // console.error('Error during download:', error);
        // Handle generic error case
        toast({ title: 'Failed to fetch file', description: error.response?.data?.message || 'An error occurred', variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
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

  return (
<>
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
      <Card className="w-full max-w-md bg-black bg-opacity-30 backdrop-blur-md border border-gray-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">File Download</CardTitle>
        </CardHeader>
        <CardContent>
          {!id && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter short file ID"
                value={fileId}
                onChange={handleInputChange}
                className="w-full p-2 bg-transparent border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
              />
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Go to File
              </Button>
            </form>
          )}

          {id && (
            <div className="space-y-4">
              <p className="text-white">File ID: {id}</p>
              {!downloadUrl ? (
                <Button
                  onClick={() => handleDownload(id)}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                >
                  {isLoading ? 'Fetching file...' : 'Fetch File'}
                </Button>
              ) : (
                <Button
                  onClick={() => window.location.href = downloadUrl}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Download File
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>

</>
  );
};

export default Download;

