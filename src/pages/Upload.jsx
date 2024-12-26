'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from '@/components/Navbar';

export const Upload = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState('');
  const [uploadStatus, setUploadStatus] = useState(null);
  const [downloadLink, setDownloadLink] = useState('');
  const { toast } = useToast();

  const onFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async () => {
    if (!file) {
      toast({ title: 'No file selected!', variant: 'destructive' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (response.data.success) {
        setUploadStatus('File uploaded successfully!');
        setDownloadLink(response.data.downloadUrl);
        setFileId(response.data.shortFileId); 
        toast({ title: 'File uploaded successfully!', variant: 'success' });
      }
    } catch (error) {
      setUploadStatus('Failed to upload file');
      toast({ title: 'File upload failed!', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md bg-black bg-opacity-30 backdrop-blur-md border border-gray-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">File Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  type="file"
                  {...register("file", { required: "Please select a file" })}
                  onChange={onFileChange}
                  className="text-white bg-transparent border-gray-700 focus:border-purple-500"
                />
                {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>}
              </div>

              <Button 
                type="submit" 
                onClick={handleSubmit(onSubmit)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Upload File
              </Button>
            </form>

            {uploadStatus && <p className="text-white mt-4">{uploadStatus}</p>}

            {downloadLink && (
              <div className="mt-4">
                <p className="text-white mb-2">Click below to download your file:</p>
                <Button onClick={() => window.location.href = downloadLink} className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Download
                </Button>
              </div>
            )}

            {fileId && (
              <div className="mt-4">
                <p className="text-white">Short File ID: {fileId}</p>
                <p className="text-gray-400 text-sm">Share this ID with others to download the file</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;
