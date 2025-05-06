"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Download, Loader, Share } from "lucide-react";
import { deletePrediction, getAllPredictions } from '@/redux-fetch-endpoints/upload';
import Image from 'next/image';
import DashboardLayout from '../DashboardLoyout/page';

export default function AnalysisResultsPage() {

  const [resultData,setResultData]=useState([]);
  const [loading,seLoading]=useState(true);
  const [error,setError]=useState(null);

  // Disease data
  const diseaseData = {
    imageName: "IMG_4532",
    imageNumber: 2,
    totalImages: 5,
    processedDate: "March 02, 2025",
    disease: "Late Blight (Phytophthora infestans)",
    severity: 80,
    spreadRisk: 90,
    confidence: 92,
    description: "Late blight is a destructive disease affecting tomatoes, causing brown lesions on leaves that can quickly spread to stems and fruits. In humid conditions, white mold may form on the underside of leaves. The disease can progress rapidly and potentially destroy entire plants.",
    recommendedActions: [
      "Remove and destroy infected plant parts",
      "Apply copper-based fungicide as soon as possible",
      "Space plants for better air circulation",
      "Water at the base of plants to keep foliage dry",
      "Monitor surrounding plants for early signs of infection"
    ]
  };


  useEffect(() => {
    const fetchallPredictions=async()=>{
      try {
        seLoading(true);
        const data = await getAllPredictions();
        setResultData(data);
        seLoading(false);
      }
      catch (error) {
        console.error('Error fetching data:', error);
        setError("Failed to load predictions. Please try again later");
        setLoading(false);
      }}
      fetchallPredictions();
    }, []);

    const formatDate = (dateString: any) => {
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this result?")) {
        try {
          console.log("ID of selected result to be deleted", id);
          await deletePrediction(id);
          
          // Only update the UI after successful deletion
          const updatedData = resultData.filter((item) => item.id !== id);
          setResultData(updatedData);
          
          window.alert("Result deleted successfully!");
        } catch (error) {
          console.error("Error deleting prediction:", error);
          window.alert("Failed to delete result. Please try again.");
        }
      }
    };

  return (
    <DashboardLayout activePage="results">
      <div className=" max-w-8xl mx-auto">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Analysis Results</h1>
          
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">Image ID: {diseaseData.imageName} • Processed on {diseaseData.processedDate}</p>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-lg bg-gray-200 hover:bg-gray-300">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span>Image {diseaseData.imageNumber} of {diseaseData.totalImages}</span>
                <Button variant="ghost" size="icon" className="rounded-lg bg-gray-200 hover:bg-gray-300">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">Save All</Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white">Export Report</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left section - Image and tabs */}
            <div>
              <div className="bg-white p-4 rounded-lg mb-4">
                <div className="bg-gray-100 h-72 rounded-lg flex items-center justify-center mb-4">
                  {/* This would be your actual image - replacing with SVG visual representation */}
                  <svg width="280" height="200" viewBox="0 0 280 200">
                    <ellipse cx="180" cy="100" rx="100" ry="80" fill="rgba(144, 238, 144, 0.7)" />
                    <ellipse cx="120" cy="100" rx="80" ry="60" fill="rgba(173, 179, 114, 0.7)" />
                    <ellipse cx="150" cy="100" rx="50" ry="30" fill="rgba(210, 105, 30, 0.7)" />
                    <ellipse cx="130" cy="120" rx="30" ry="20" fill="rgba(210, 105, 30, 0.7)" />
                    <ellipse cx="140" cy="90" rx="100" ry="40" fill="rgba(255, 182, 193, 0.4)" strokeWidth="2" stroke="rgba(255, 182, 193, 0.8)" />
                  </svg>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="ghost" className="rounded-full bg-gray-200 hover:bg-gray-300">Original</Button>
                  <Button className="rounded-full bg-teal-500 hover:bg-teal-600 text-white">Analyzed</Button>
                  <Button variant="ghost" className="rounded-full bg-gray-200 hover:bg-gray-300">Healthy Ref</Button>
                  <Button variant="ghost" className="rounded-full bg-gray-200 hover:bg-gray-300">Zoom</Button>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h2 className="font-semibold text-lg mb-2">Detected Disease</h2>
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 text-red-800 px-4 py-1 rounded-full">
                    Late Blight
                  </div>
                  <p className="text-gray-700">Confidence: {diseaseData.confidence}%</p>
                </div>
              </div>
            </div>
            
            {/* Right section - Disease Info */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-2">{diseaseData.disease}</h2>
              
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Severity:</span>
                </div>
                <Progress value={diseaseData.severity} className="h-4 bg-gray-200" />
                <div className="text-right text-sm">High ({diseaseData.severity}%)</div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-1">Description:</h3>
                <p className="text-sm text-gray-700">{diseaseData.description}</p>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Disease Spread Risk:</span>
                </div>
                <Progress value={diseaseData.spreadRisk} className="h-4 bg-gray-200" />
                <div className="text-right text-sm">Very High ({diseaseData.spreadRisk}%)</div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Recommended Actions:</h3>
                <ul className="space-y-2">
                  {diseaseData.recommendedActions.map((action, index) => (
                    <li key={index} className="flex items-center">
                      <div className="h-3 w-3 bg-gray-800 rounded-full mr-2"></div>
                      <p className="text-sm">{action}</p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1 bg-teal-500 hover:bg-teal-600 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button className="flex-1 bg-orange-400 hover:bg-orange-500 text-white">
                  <Share className="w-4 h-4 mr-2" />
                  Share Results
                </Button>
                <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                  Treatment Plan
                </Button>
              </div>
            </Card>
          </div>
          
          {/* History Table */}
          <div className="mt-8 bg-white p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Recent Analysis History</h2>
            {
              loading?(
                <div className='flex justify-center '>
                <Loader  />
                </div>
              ):error?(
                <p className='text-red-500'>{error}</p>
              ):
            resultData.length>0 ?(
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-700">
                
                  <th className="pb-2">Image No</th>
                  <th className='pb-2'>Image view</th>
                  <th className="pb-2">Generated Date</th>
                  <th className="pb-2">Result</th>
                  <th className="pb-2">Confidence</th>
                  <th className='pb-2'> Actions</th>
                </tr>
              </thead>
              <tbody>
                {resultData.map((item, index) => (
                  <tr key={index} className="border-t border-gray-200">
                   
                    <td>{item.id}</td>
                    <td className="px-3 py-2">
                   {item.image && (
                  <div className="w-16 h-16 rounded overflow-hidden">
                   <Image 
                  src={`http://localhost:8000${item.image}`} 
                  alt="Uploaded leaf" 
                  className="w-full h-full object-cover"
                  width={20} height={20}
                   />
                  </div>
                    )}
                   </td>
                    <td className="py-3">{formatDate(item.created_at)}</td>
                    <td>
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            item.class_name === "Healthy" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-orange-100 text-orange-800"
                          }`}>
                            {item.class_name}
                          </span>
                        </td>
                    <td>{item.confidence}%</td>
                    
                    
                    <td className='flex gap-2 mt-4'>
                      <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white text-xs py-1">
                        View
                      </Button>
                      <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white text-xs py-1" onClick={()=>handleDelete(item.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            ):(
            <p className='text-gray-600 text-xl'> There are no Predictions in the System!</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}