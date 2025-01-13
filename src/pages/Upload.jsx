'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { useToast } from "../hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from '@/components/Navbar'
import { UploadIcon, CheckCircle, Copy } from 'lucide-react'

export const Upload = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [fileId, setFileId] = useState('')
  const [downloadLink, setDownloadLink] = useState('')
  const { toast } = useToast()

  const onFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const onSubmit = async () => {
    if (!file) {
      toast({ title: 'No file selected!', variant: 'destructive' })
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      
      if (response.data.success) {
        setUploadSuccess(true)
        setDownloadLink(response.data.downloadUrl)
        setFileId(response.data.shortFileId)
        toast({ title: 'File uploaded successfully!', variant: 'success' })
      }
    } catch (error) {
      toast({ title: 'File upload failed!', variant: 'destructive' })
    } finally {
      setIsUploading(false)
    }
  }

  const resetUpload = () => {
    setFile(null)
    setUploadSuccess(false)
    setFileId('')
    setDownloadLink('')
    reset()
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast({ title: 'Copied to clipboard!', variant: 'success' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black bg-opacity-30 backdrop-blur-md border border-gray-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">File Upload</CardTitle>
          </CardHeader>
          <CardContent>
            {!uploadSuccess ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="relative">
                  <Input
                    type="file"
                    {...register("file", { required: "Please select a file" })}
                    onChange={onFileChange}
                    className="text-white  bg-transparent border-gray-700 focus:border-purple-500 file:mr-4  file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                  />
                  {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>}
                </div>

                <Button 
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                  {isUploading ? (
                    <span className="flex items-center justify-center">
                      <UploadIcon className="animate-bounce mr-2" size={20} />
                      Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <UploadIcon className="mr-2" size={20} />
                      Upload File
                    </span>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center text-green-500">
                  <CheckCircle size={48} />
                </div>
                <p className="text-white text-center">File uploaded successfully!</p>
                <div className="bg-gray-800 p-3 rounded-md flex items-center justify-between">
                  <span className="text-white">File ID: {fileId}</span>
                  <Button
                    onClick={() => copyToClipboard(fileId)}
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy size={20} />
                  </Button>
                </div>
                <Button 
                  onClick={() => window.location.href = downloadLink}
                  className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                  Download File
                </Button>
                <Button 
                  onClick={resetUpload}
                  className="w-full text-white border-white hover:bg-white hover:text-purple-700 transition-all duration-200 ease-in-out"
                >
                  Upload Another File
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Upload

