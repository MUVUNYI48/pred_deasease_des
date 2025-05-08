"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { deletePrediction, getAllPredictions } from '@/redux-fetch-endpoints/upload';
import Image from 'next/image';
import DashboardLayout from '../DashboardLoyout/page';
import { Modal } from 'antd';
import { Loader } from 'lucide-react';

export default function AnalysisResultsPage() {
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRec, setShowRec] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  useEffect(() => {
    const fetchAllPredictions = async () => {
      try {
        setLoading(true);
        const data = await getAllPredictions();
        setResultData(data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError("Failed to load predictions. Please try again later");
        setLoading(false);
      }
    };
    fetchAllPredictions();
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
        await deletePrediction(id);
        const updatedData = resultData.filter((item) => item.id !== id);
        setResultData(updatedData);
        window.alert("Result deleted successfully!");
      } catch (error) {
        console.error("Error deleting prediction:", error);
        window.alert("Failed to delete result. Please try again.");
      }
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(resultData.length / resultsPerPage);
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = resultData.slice(indexOfFirstResult, indexOfLastResult);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  return (
    <DashboardLayout activePage="results">
      <div className="max-w-8xl mx-auto">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Analysis Results</h1>
          <div className="mt-8 bg-white p-6 rounded-lg">
            {loading ? (
              <div className='flex justify-center'><Loader /></div>
            ) : error ? (
              <p className='text-red-500'>{error}</p>
            ) : resultData.length > 0 ? (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-700">
                      <th className="pb-2">Image No</th>
                      <th className='pb-2'>Image view</th>
                      <th className="pb-2">Generated Date</th>
                      <th className="pb-2">Result</th>
                      <th className="pb-2">Confidence</th>
                      <th className='pb-2'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentResults.map((item, index) => (
                      <tr key={item.id} className="border-t border-gray-200">
                        <td>{indexOfFirstResult + index + 1}</td>
                        <td className="px-3 py-2">
                          {item.image_url && (
                            <div className="w-16 h-16 rounded overflow-hidden">
                              <Image 
                                src={`http://localhost:8000${item.image_url}`} 
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
                          <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white text-xs py-1" onClick={() => setShowRec(true)}>
                            View
                          </Button>
                          <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white text-xs py-1" onClick={() => handleDelete(item.id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="mt-4 flex justify-between items-center">
  <span className="text-gray-700 text-sm">
    Showing {indexOfFirstResult + 1} to {Math.min(indexOfLastResult, resultData.length)} of {resultData.length} Results
  </span>
  <div className="flex items-center gap-1">
    <Button
      onClick={handlePrevPage}
      disabled={currentPage === 1}
      className="px-3 py-1 text-sm"
      variant="outline"
    >
      &lt;
    </Button>
    {[...Array(totalPages)].map((_, i) => (
      <Button
        key={i + 1}
        onClick={() => handlePageClick(i + 1)}
        className={`px-3 py-1 text-sm ${
          currentPage === i + 1 ? "bg-red-500 text-white" : ""
        }`}
        variant={currentPage === i + 1 ? "default" : "outline"}
      >
        {i + 1}
      </Button>
    ))}
    <Button
      onClick={handleNextPage}
      disabled={currentPage === totalPages}
      className="px-3 py-1 text-sm"
      variant="outline"
    >
      &gt;
    </Button>
  </div>
</div>

              </>
            ) : (
              <p className='text-gray-600 text-xl'>There are no Predictions in the System!</p>
            )}
          </div>
        </div>
      </div>

      <Modal open={showRec} onCancel={() => setShowRec(false)} footer={null} className="rounded-lg">
        <div>
          <h1 className='text-xl font-semibold'>Recommendation:</h1>
          <p className='text-gray-400 text-md'>
            {/* Recommendation content */}
          </p>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
