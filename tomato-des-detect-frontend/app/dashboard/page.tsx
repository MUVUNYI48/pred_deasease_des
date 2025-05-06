"use client";
import { useState, useEffect, useRef } from "react";
import { PlusCircle, X } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import DashboardLayout from "../DashboardLoyout/page";
import { getAllPredictions, uploadImage } from "@/redux-fetch-endpoints/upload";
import Image from "next/image";
import { Button } from "antd";
import FileUpload from "@/components/file-upload";
export default function Dashboard() {
  const [imageCount, setImageCount] = useState(0);
  const [diseaseCount, setDiseaseCount] = useState(0);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  // Sample data (in a real app, this would come from an API or props)
  const [analyticData, setAnalyticData] = useState([]);
  const [diseaseDistribution, setDiseaseDistribution] = useState([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [showUploadArea, setShowUploadArea] = useState(true);
   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
   const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString: any) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

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
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

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
  const handleChangeImage = () => {
    // Use a hidden file input to trigger the file browser
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
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

  // useEffect to sum up all images analyzed
  useEffect(() => {
    const fetchData = async () => {
      try {
        const predictionsData = await getAllPredictions();
        setImageCount(predictionsData.length);

        // Count disease instances (you may need to adjust this logic based on your data structure)
        const diseasedPredictions = predictionsData.filter(
          (prediction) => prediction.class_name !== "Healthy"
        );

        const healthyPredictions = predictionsData.filter(
          (prediction) => prediction.class_name === "Healthy"
        );
        const healthyCount = healthyPredictions.length;
        const diseasedCount = diseasedPredictions.length;

        const healthyPercentage =
          predictionsData.length > 0
            ? Math.round((healthyCount / predictionsData.length) * 100)
            : 0;

        setDiseaseCount(diseasedCount);
        setRecentAnalyses(predictionsData.slice(0, 5)); // Get the last 5 analyses
        // You could also update other analytics here
        setAnalyticData({
          imagesAnalyzed: predictionsData.length,
          imagesGrowth: Math.round(
            ((predictionsData.length - healthyCount) / predictionsData.length) *
              100
          ),
          diseasesDetected: diseasedCount,
          healthyPercentage: healthyPercentage,
        });
        const diseaseGroups = {};
        diseasedPredictions.forEach((prediction) => {
          const diseaseName = prediction.class_name;
          if (diseaseGroups[diseaseName]) {
            diseaseGroups[diseaseName] += 1;
          } else {
            diseaseGroups[diseaseName] = 1;
          }
        });
        const colorMap = {
          Healthy: "#2A9D8F", // Teal
          "Yellow Leaf Curl Virus": "#FCBF49", // Gold
          "Bacterial Spot": "#6A994E", // Green
          "Late Blight": "#E76F51", // Orange-red
          "Early Blight": "#5F4B8B", // Purple
          "Leaf Mold": "#577590", // Blue
          Other: "#4C4C4C", // Dark gray
        };
        const distributionData = Object.keys(diseaseGroups).map(
          (diseaseName) => {
            return {
              name: diseaseName,
              value: diseaseGroups[diseaseName],
              color:
                colorMap[diseaseName] ||
                `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            };
          }
        );
        setDiseaseDistribution(distributionData);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout activePage="dashboard">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-sm text-gray-600">
                Welcome back, {"{username}"}. Here&apos;s the current status of
                your tomato crops.
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Images Analyzed Card */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-sm font-medium text-gray-500 mb-2">
                  Images Analyzed
                </h2>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold text-teal-600">
                    {imageCount}
                  </span>
                  <span className="text-xs text-gray-500">last 7 days</span>
                </div>
                <div className="mt-2 text-xs text-green-600">
                  +{analyticData.imagesGrowth}% from previous period
                </div>
              </div>

              {/* Disease Detected Card */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-sm font-medium text-gray-500 mb-2">
                  Disease Detected
                </h2>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold text-red-500">
                    {diseaseCount}
                  </span>
                  <span className="text-xs text-gray-500">instances</span>
                </div>
                <div className="mt-2 text-xs text-red-500">
                  Early intervention needed
                </div>
              </div>

              {/* Healthy Plants Card */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-sm font-medium text-gray-500 mb-2">
                  Healthy Plants
                </h2>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold text-teal-600">
                    {analyticData.healthyPercentage}%
                  </span>
                  <span className="text-xs text-gray-500"></span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Farm-wide average
                </div>
              </div>
            </div>

            {/* Recent Analysis Table */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-700 mb-4">
                Recent Analysis
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2  text-left text-sm font-medium text-gray-500 tracking-wider">
                        ID
                      </th>
                      <th className="py-2 text-left text-sm font-medium text-gray-500 tracking-wider">
                        Image
                      </th>
                      <th className="py-2 text-left text-sm font-medium text-gray-500 tracking-wider">
                        Date
                      </th>
                      <th className="py-2 text-left text-sm font-medium text-gray-500 tracking-wider">
                        Result
                      </th>
                      <th className="py-2 text-left text-sm font-medium text-gray-500 tracking-wider">
                        Confidence
                      </th>
                      <th className="py-2 text-left text-sm font-medium text-gray-500 tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAnalyses.map((analysis, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-3 text-sm">{index + 1}</td>
                        <td className="px-3 py-2">
                          {analysis.image && (
                            <div className="w-16 h-16 rounded overflow-hidden">
                              <Image
                                src={`http://localhost:8000${analysis.image}`}
                                alt="Uploaded leaf"
                                className="w-full h-full object-cover"
                                width={20}
                                height={20}
                              />
                            </div>
                          )}
                        </td>
                        <td className="py-3 text-sm">
                          {formatDate(analysis.created_at)}
                        </td>
                        <td className="py-3 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${
                              analysis.class_name === "Healthy"
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {analysis.class_name}
                          </span>
                        </td>
                        <td>{analysis.confidence}%</td>
                        <td className="py-3 text-sm">
                          <button className="bg-teal-500 hover:bg-teal-600 text-white text-xs px-3 py-1 rounded">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Disease Distribution and Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Disease Distribution Chart */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-700 mb-4">
                  Disease Distribution
                </h2>
                <div className="h-75">
                  <ResponsiveContainer width="120%" height="100%">
                    <PieChart>
                      <Pie
                        data={diseaseDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {diseaseDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        formatter={(value, entry) => {
                          return (
                            <span style={{ color: entry.color }}>{value}</span>
                          );
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-700 mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-3 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition">
                    <span>Upload New Images</span>
                    <PlusCircle size={16} />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-green-50 text-teal-500 rounded-md hover:bg-green-100 transition">
                    <span>Generate Weekly Report</span>
                    <PlusCircle size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Upload Section - 1/4 width on large screens */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow h-full">
              <h2 className="text-lg font-medium text-gray-700 mb-4">
                Quick Upload
              </h2>

              {/* Drag & Drop Area */}
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
      </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
