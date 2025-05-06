"use client";

import { useState } from 'react';
import { Calendar, ChevronDown, Download, Filter, FileText, PieChart } from 'lucide-react';
import DashboardLayout from '../DashboardLoyout/page';

// Sample data - in production, this would come from your API
const sampleReports = [
  {
    id: "REP_1032",
    date: "Apr 03, 2025",
    title: "Weekly Disease Analysis",
    type: "Disease Trends",
    status: "Complete",
    summary: "28 disease instances detected across 124 images. Late Blight is the most common issue."
  },
  {
    id: "REP_1031",
    date: "Apr 01, 2025", 
    title: "Field Zone Comparison",
    type: "Zone Analysis",
    status: "Complete",
    summary: "Eastern zones show 15% higher disease rates than western zones. Recommend soil testing."
  },
  {
    id: "REP_1030",
    date: "Mar 28, 2025",
    title: "Monthly Health Overview",
    type: "Health Summary",
    status: "Complete",
    summary: "76% healthy plants detected. Farm-wide health improved by 8% compared to previous month."
  },
  {
    id: "REP_1029",
    date: "Mar 25, 2025",
    title: "Treatment Effectiveness",
    type: "Treatment Analysis",
    status: "Complete",
    summary: "Fungicide treatment shows 62% effectiveness against Late Blight. Recommend continuing application."
  },
];


export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    reportType: 'All',
    dateRange: 'Last 30 days',
  });

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const openReportDetail = (report) => {
    setSelectedReport(report);
  };

  const closeReportDetail = () => {
    setSelectedReport(null);
  };

  return (
    <DashboardLayout activePage='Reports'>
    <div className="px-6  max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Reports</h1>
        
        <div className="flex gap-3">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm hover:bg-gray-50"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter size={16} />
            <span>Filter</span>
            <ChevronDown size={16} />
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-md shadow-sm text-sm hover:bg-teal-600">
            <PieChart size={16} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>
      
      {filterOpen && (
        <div className="bg-white p-4 mb-6 rounded-md shadow border border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 w-48"
                value={filters.reportType}
                onChange={(e) => handleFilterChange('reportType', e.target.value)}
              >
                <option>All</option>
                <option>Disease Trends</option>
                <option>Zone Analysis</option>
                <option>Health Summary</option>
                <option>Treatment Analysis</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 w-48"
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Custom Range</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button className="px-4 py-2 bg-gray-100 text-gray-600 border border-gray-300 rounded-md text-sm hover:bg-gray-200">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="bg-white rounded-md shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sampleReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {report.date}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => openReportDetail(report)}
                    className="text-teal-600 hover:text-teal-900 mr-3"
                  >
                    View
                  </button>
                  <button className="text-teal-600 hover:text-teal-900">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">{selectedReport.title}</h2>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                    <Download size={16} />
                    <span>Download PDF</span>
                  </button>
                  <button 
                    onClick={closeReportDetail}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded">
                  <div className="text-sm text-gray-500">Report ID</div>
                  <div className="font-medium">{selectedReport.id}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="text-sm text-gray-500">Generated On</div>
                  <div className="font-medium">{selectedReport.date}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="text-sm text-gray-500">Report Type</div>
                  <div className="font-medium">{selectedReport.type}</div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Summary</h3>
                <p className="text-gray-600">{selectedReport.summary}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Disease Distribution</h3>
                  <div className="bg-gray-50 p-4 rounded h-64 flex items-center justify-center">
                    {/* This would be a Pie chart in real implementation */}
                    <div className="text-gray-400 text-center">
                      <FileText size={48} className="mx-auto mb-2" />
                      <p>Pie chart showing disease distribution would appear here</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Disease Trend</h3>
                  <div className="bg-gray-50 p-4 rounded h-64 flex items-center justify-center">
                    {/* This would be a Line chart in real implementation */}
                    <div className="text-gray-400 text-center">
                      <FileText size={48} className="mx-auto mb-2" />
                      <p>Line chart showing disease trends would appear here</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Recommended Actions</h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Early intervention is needed for Late Blight detected in 28 instances. Apply fungicide treatment within 48 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Affected Areas</h3>
                <div className="overflow-hidden overflow-x-auto border border-gray-200 rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disease</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action Required</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Zone A (East)</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Late Blight</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            High
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Immediate fungicide treatment</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Zone B (Central)</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Leaf Spot</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Medium
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Monitor and treat if spreading</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Zone C (West)</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Healthy</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            None
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Routine monitoring</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
}