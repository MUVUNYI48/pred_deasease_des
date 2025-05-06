// components/file-upload.tsx
"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FileUploadProps {
  onFilesSelected: (files: FileList) => void;
  multiple?: boolean;
  accept?: string;
}

export default function FileUpload({ onFilesSelected, multiple = true, accept = "image/*" }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  // Handle button click to open file dialog
  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-12 h-64 transition-colors ${dragActive ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="bg-red-50 rounded-full p-4 mb-4">
        <Plus className="w-8 h-8 text-red-400" />
      </div>
      <p className="text-center text-gray-500 mb-2">Drag & Drop Images Here</p>
      <p className="text-center text-gray-400 text-sm mb-4">or</p>
      <Button 
        className="bg-red-500 hover:bg-red-600"
        onClick={handleButtonClick}
      >
        Browse Files
      </Button>
    </div>
  );
}