"use client";

import React, { useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DashboardLayout from '../DashboardLoyout/page';

export default function ImageProcessingPage() {
  // Overall progress state
  const [overallProgress, setOverallProgress] = useState(60);
  
  // Node states
  const nodes = [
    { id: 1, name: "Node 1", task: "Image Preprocessing", progress: 100, completed: true },
    { id: 2, name: "Node 2", task: "Feature Extraction", progress: 100, completed: true },
    { id: 3, name: "Node 3", task: "Model Inference", progress: 60, completed: false },
    { id: 4, name: "Node 4", task: "Results Processing", progress: 0, completed: false }
  ];

  // Processing details
  const processingDetails = [
    { task: "Task Distribution", status: "Complete" },
    { task: "Image Preprocessing", status: "Complete" },
    { task: "Feature Extraction", status: "Complete" },
    { task: "Machine Learning Analysis", status: "In Progress" },
    { task: "Results Compilation", status: "Pending" }
  ];

  // Grid resources
  const gridResources = [
    "Using 4 distributed computing nodes",
    "TensorFlow Distributed for ML tasks",
    "Processing speed: 1.2 images/minute"
  ];

  // Images being processed
  const images = [
    { id: "1/5", status: "Complete", condition: "Healthy" },
    { id: "2/5", status: "Complete", condition: "Late Blight" },
    { id: "3/5", status: "In Progress", progress: "60%" }
  ];

  return (
    <DashboardLayout activePage="imageProcessing">
    <div className=" max-w-8xl mx-auto bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Processing Images</h1>
      
      <p className="text-blue-600 underline mb-4">Your images are being analyzed using our grid computing framework</p>
      
      {/* Overall Progress */}
      <div className="mb-8">
        <Progress value={overallProgress} className="h-4 bg-gray-200" />
        <p className="text-right mt-1 text-sm text-gray-500">{overallProgress}%</p>
      </div>
      
      {/* Grid Computing Status */}
      <Card className="p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Grid Computing Status</h2>
        
        <div className="flex flex-wrap gap-2">
          {nodes.map((node, index) => (
            <div key={node.id} className="relative flex-1 min-w-52">
              <div className={`p-4 border rounded-md ${node.completed ? 'bg-green-50' : node.progress > 0 ? 'bg-orange-50' : 'bg-gray-50'}`}>
                <p className="font-medium text-center">{node.name}</p>
                <p className="text-sm text-center text-gray-600">{node.task}</p>
                <Progress 
                  value={node.progress} 
                  className={`h-2 mt-2 ${node.completed ? 'bg-green-200' : 'bg-orange-200'}`} 
                />
                <p className="text-right text-xs mt-1">{node.progress}%</p>
              </div>
              
              {/* Connector lines between nodes */}
              {index < nodes.length - 1 && (
                <div className="absolute top-1/2 -right-1 w-2 h-2 bg-black rounded-full z-10"></div>
              )}
              {index < nodes.length - 1 && (
                <div className="absolute top-1/2 -right-8 w-16 h-px bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      </Card>
      
      {/* Processing 5 Images */}
      <Card className="p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Processing 5 Images</h2>
          <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">Cancel</Button>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {images.map((image) => (
            <div key={image.id} className="flex items-center">
              <span className="text-gray-500 mr-2">•</span>
              <p className="text-sm">
                Image {image.id}: {image.status} {image.condition && `(${image.condition})`} {image.progress && `(${image.progress})`}
              </p>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Two column layout for Details and Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Processing Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Processing Details</h2>
          <ul className="space-y-2">
            {processingDetails.map((detail, index) => (
              <li key={index} className="flex items-center">
                <span className="text-gray-500 mr-2">•</span>
                <p className="text-sm">{detail.task}: {detail.status}</p>
              </li>
            ))}
          </ul>
        </Card>
        
        {/* Grid Computing Resources */}
        <div className="space-y-4">
          <Card className="p-6 mb-4">
            <h3 className="font-medium mb-2">Estimated time remaining:</h3>
            <p className="text-center font-bold text-lg">45 seconds</p>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Grid Computing Resources</h2>
            <ul className="space-y-2">
              {gridResources.map((resource, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-gray-500 mr-2">•</span>
                  <p className="text-sm">{resource}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}