// app/upload/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import FileUpload from '@/components/file-upload';
import Link from 'next/link';
import { X } from 'lucide-react';
import { uploadImage } from '@/redux-fetch-endpoints/upload';
import DashboardLayout from '../DashboardLoyout/page';

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [showUploadArea, setShowUploadArea] = useState(true);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle files selected from FileUpload component
  const handleFilesSelected = (files: FileList) => {
    const filesArray = Array.from(files);
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles(filesArray);
    const previewUrls = filesArray.map(file => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
    // Hide the upload area when images are selected
    if (filesArray.length > 0) {
      setShowUploadArea(false);
    }
  };

  // Handle removing an image from selection
  const handleRemoveImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreviews[index]);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setSelectedFiles(newFiles);
    setImagePreviews(newPreviews);
    if (newFiles.length === 0) {
      setShowUploadArea(true);
    }
  };

  // Handle changing the image
  const handleChangeImage = () => {
    // Use a hidden file input to trigger the file browser
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle the file selection for changing image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFilesSelected(files);
    }
    
    // Reset the file input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle camera photo capture
  const handleTakePhoto = () => {
    // In a real application, this would access the device camera
    alert("Camera functionality would open here");
  };

  // Clean up URLs to prevent memory leaks when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  // uploading implementation

  const handleUploadImage = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select an image to upload.");
      return;
    }
    setIsLoading(true);
    try{
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('image', file);
      });
      const result = await uploadImage(formData);
      setUploadResult(result);
      alert("Image uploaded successfully");
      console.log(result);
     
    }
    catch(error){
      alert("Error uploading image: " + error);
    }
    finally{
      setIsLoading(false);
    }
  }
// Function to fetch image results



  return (
    <DashboardLayout activePage="upload">
      <h1 className="text-2xl font-bold mb-4">Upload Images</h1>
      <p className="text-gray-600 mb-8">
        Select or drag images of tomato leaves for disease analysis
      </p>
      
      {/* Hidden file input for changing images */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
        accept="image/*"
      />
      
      <div className="flex gap-8">
        {/* Left Column - Upload Area or Image Previews */}
        <div className="flex-1 ">
          {showUploadArea ? (
            <FileUpload 
              onFilesSelected={handleFilesSelected}
              multiple={false}
              accept="image/*"
            />
          ) : (
            <div className="border-2 border-dashed grid justify-center items-center border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden">
                    <div className="relative h-64 w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={preview} 
                        alt={`Selected image ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 truncate">
                      {selectedFiles[index].name}
                    </div>
                    <button 
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      aria-label="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={handleChangeImage}
                  variant="outline"
                  className="mr-2"
                >
                  Change Image
                </Button>
                <Button 
                  className="bg-teal-500 hover:bg-teal-600"
                  onClick={handleUploadImage}
                  disabled={isLoading}
                >
                  Upload Image{selectedFiles.length > 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Camera and Batch Processing */}
        <div className="w-80 space-y-8">
          {/* Camera Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
            <h2 className="font-bold mb-4">Use Camera</h2>
            <div className="bg-gray-200 h-40 mb-4 rounded-lg flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-teal-400 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-teal-200 rounded-full"></div>
              </div>
            </div>
            <Button 
              className="w-full bg-teal-500 hover:bg-teal-600"
              onClick={handleTakePhoto}
            >
              Take Photo
            </Button>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-4 bg-[#f4f4f4] px-5 border border-gray-300 rounded-lg py-3">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Uploaded Results</h2>
          <Button 
            variant="outline" 
            className="text-sm"
            onClick={()=>setUploadResult(null)}
          >
            Clear Results
          </Button>
        </div>
        { uploadResult ? (
          <table className="w-full text-left">
            <thead className="bg-gray-200 text-gray-700">
              <tr className="border-b border-gray-300">
                <th className="font-semibold px-3 py-2">Image No</th>
                <th className="font-semibold px-3 py-2">Predictions</th>
                <th className="font-semibold px-3 py-2">Confidence</th>
              </tr>
            </thead>
            <tbody>
                <tr  className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="px-3 py-2">{uploadResult.image_id}</td>
                  <td className="px-3 py-2">{uploadResult.prediction}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-teal-500 h-2.5 rounded-full" 
                          style={{ width: `${uploadResult.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span>{(uploadResult.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
            
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No results found. Upload an image to see analysis results.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}