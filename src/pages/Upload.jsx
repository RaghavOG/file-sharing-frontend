'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { useToast } from "../hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from '@/components/Navbar'
import { UploadIcon, CheckCircle, Copy, Lock } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import Footer from '@/components/Footer'

export const Upload = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [fileId, setFileId] = useState('')
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [password, setPassword] = useState('')
  const { toast } = useToast()

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB (matching backend)

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

    if (file.size > MAX_FILE_SIZE) {
      toast({ title: 'File size exceeds 100MB!', variant: 'destructive' });
      return;
    }

    if (isPasswordProtected && !password) {
      toast({ title: 'Please enter a password!', variant: 'destructive' });
      return;
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    if (isPasswordProtected) {
      formData.append('password', password)
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      
      if (response.data.success) {
        setUploadSuccess(true)
        setFileId(response.data.shortFileId)
        toast({ 
          title: response.data.message,
          variant: 'success' 
        })
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 413) {
          toast({ title: 'File too large! Please upload a file smaller than 100MB.', variant: 'destructive' });
        } else if (error.response.status === 400) {
          toast({ title: error.response.data.message, variant: 'destructive' });
        } else {
          toast({ title: 'Upload failed. Please try again later.', variant: 'destructive' });
        }
      } else {
        toast({ title: 'Network error. Please check your connection.', variant: 'destructive' });
      }
    } finally {
      setIsUploading(false)
    }
  }

  const resetUpload = () => {
    setFile(null)
    setUploadSuccess(false)
    setFileId('')
    setPassword('')
    setIsPasswordProtected(false)
    reset()
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast({ title: 'Copied to clipboard!', variant: 'success' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md mx-4 relative overflow-hidden bg-black/30 backdrop-blur-lg border border-purple-500/20 shadow-2xl rounded-xl hover:border-purple-500/40 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />
          <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
          
          <CardHeader className="relative">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse">
                File Upload
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="relative space-y-6">
            {!uploadSuccess ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="relative group">
                  <Input
                    type="file"
                    {...register("file", { required: "Please select a file" })}
                    onChange={onFileChange}
                    className="text-white bg-white/5 border-gray-700 focus:border-purple-500 file:mr-4 file:pb-1 file:px-4 
                    file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white 
                    hover:file:bg-purple-700 transition-all duration-200 file:cursor-pointer cursor-pointer
                    focus:ring-2 focus:ring-purple-500/40"
                  />
                  {errors.file && <p className="text-red-400 text-sm mt-1">{errors.file.message}</p>}
                </div>

                <div className="flex items-center justify-between space-x-2 p-4 rounded-lg bg-white/5">
                  <div className="flex items-center space-x-2">
                    <Lock size={20} className="text-purple-400" />
                    <Label htmlFor="password-protection" className="text-white">Password Protection</Label>
                  </div>
                  <Switch
                    id="password-protection"
                    checked={isPasswordProtected}
                    onCheckedChange={setIsPasswordProtected}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>

                {isPasswordProtected && (
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/5 border-gray-700 text-white"
                    />
                  </div>
                )}

                <Button 
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 
                  ease-in-out transform hover:scale-102 hover:shadow-lg hover:shadow-purple-500/20 rounded-lg"
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
              <div className="space-y-6">
                <div className="flex items-center justify-center text-green-400">
                  <CheckCircle size={48} className="animate-pulse" />
                </div>
                <p className="text-white/90 text-center text-lg font-medium">File uploaded successfully!</p>
                <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-purple-500/20 
                flex items-center justify-between group hover:border-purple-500/40 transition-all duration-300">
                  <span className="text-white/90">File ID: {fileId}</span>
                  <Button
                    onClick={() => copyToClipboard(fileId)}
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <Copy size={20} />
                  </Button>
                </div>
                <Button 
                  onClick={resetUpload}
                  className="w-full border-2 border-white/20 hover:border-white/40 text-white hover:bg-white/10 
                  transition-all duration-200 ease-in-out backdrop-blur-sm rounded-lg"
                >
                  Upload Another File
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}

export default Upload