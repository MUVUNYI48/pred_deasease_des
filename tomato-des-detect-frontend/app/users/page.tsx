"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLoyout/page";
import { LoadingOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader,
} from "lucide-react";
import {
  get_all_users,
  getPredictionsForUser,
  update_user,
  delete_user,
} from "@/redux-fetch-endpoints/users-redux";
import Image from "next/image";
import { Form, Modal } from "antd";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [users, setUsers] = useState([]);
  const [showUpdateUser, setShowUpdateUser] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userPredictions, setUserPredictions] = useState({});
  const [loadingPredictions, setLoadingPredictions] = useState({});
  const [expandedUser, setExpandedUser] = useState(null);
  const [error, setError] = useState(null);

  const [form] = Form.useForm();

  // Base URL constant
  const BASE_URL = "http://localhost:8000";

  // Helper function to safely build image URLs
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/40";

    // Make sure path starts with '/'
    const safePath = path.startsWith("/") ? path : `/${path}`;
    return `${BASE_URL}${safePath}`;
  };

  // Fetch users on component mount
  // Updated useEffect to fetch users and their prediction counts
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await get_all_users();
        setUsers(data);

        // Create a map to store prediction counts
        const predictionCounts = {};

        // Fetch prediction counts for all users in parallel
        const fetchPromises = data.map(async (user) => {
          try {
            const predictions = await getPredictionsForUser(user.id);
            return {
              userId: user.username,
              predictions: Array.isArray(predictions) ? predictions : [],
            };
          } catch (error) {
            console.error(
              `Error fetching predictions for user ${user.id}:`,
              error
            );
            return { userId: user.username, predictions: [] };
          }
        });

        // Wait for all prediction fetches to complete
        const results = await Promise.all(fetchPromises);

        // Process results into the prediction counts object
        results.forEach((result) => {
          predictionCounts[result.userId] = result.predictions;
        });

        setUserPredictions(predictionCounts);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // use effect for showing the current user data in the form
  useEffect(() => {
    if (showUpdateUser && currentUser) {
      form.setFieldsValue({
        fullName: currentUser.fullname,
        email: currentUser.email,
        phoneNumber: currentUser.phone_number,
      });
    }
  }, [currentUser, form, showUpdateUser]);

  const handleGetPredictions = async (userId) => {
    // If clicking on the same user, toggle expansion
    if (expandedUser === userId) {
      setExpandedUser(null);
      return;
    }

    setExpandedUser(userId);

    // Only fetch if we haven't loaded detailed predictions yet
    if (!Array.isArray(userPredictions[userId])) {
      // Set loading state for this user
      setLoadingPredictions((prev) => ({ ...prev, [userId]: true }));

      try {
        const user = users.find((user) => user.username === userId);
        const actualUserId = user ? user.id : userId;
        console.log(
          `Fetching predictions for user: ${userId} with ID: ${actualUserId}`
        );
        const predictions = await getPredictionsForUser(actualUserId);
        console.log(`Received predictions:`, predictions);

        // Store the full prediction data array
        setUserPredictions((prev) => ({
          ...prev,
          [userId]: Array.isArray(predictions) ? predictions : [],
        }));
      } catch (error) {
        console.error(`Error fetching predictions for user ${userId}:`, error);
        // Set an empty array on error
        setUserPredictions((prev) => ({
          ...prev,
          [userId]: [],
        }));
      } finally {
        setLoadingPredictions((prev) => ({ ...prev, [userId]: false }));
      }
    }
  };

  // Function to handleUpdate
  const handleSubmit = async (values) => {
    setLoadingUpdate(true);
    try {
      const result = await update_user(currentUser.id, {
        fullname: values.fullName,
        email: values.email,
        phone_number: values.phoneNumber,
      });

      console.log("User updated successfully:", result);
      alert("User updated successfully!");

      // Update local state to reflect changes
      setUsers(
        users.map((user) =>
          user.username === currentUser.username
            ? {
                ...user,
                fullname: values.fullName,
                email: values.email,
                phone_number: values.phoneNumber,
              }
            : user
        )
      );

      setShowUpdateUser(false);
      setCurrentUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user: " + error.message);
    }
    setLoadingUpdate(false);
  };

  // Handle user deletion
  const handleDelete = async (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await delete_user(userId);
        // Update state after successful deletion
        setUsers(users.filter((user) => user.username !== userId));
        alert(`User deleted successfully`);
        await get_all_users(); // Refresh the user list
      } catch (error) {
        console.error("Error deleting user:", error);
        alert(`Error deleting user: ${error.message}`);
      }
    }
  };

  // Get the prediction count for a user
  const getPredictionCount = (userId) => {
    const predictions = userPredictions[userId];
    if (Array.isArray(predictions)) {
      return predictions.length;
    }
    return typeof predictions === "number" ? predictions : 0;
  };

  // Filter users based on search term
  const filteredUsers =
    users && users.length > 0
      ? users.filter(
          (user) =>
            (user.fullname?.toLowerCase() || "").includes(
              searchTerm.toLowerCase()
            ) ||
            (user.email?.toLowerCase() || "").includes(
              searchTerm.toLowerCase()
            ) ||
            (user.district?.toLowerCase() || "").includes(
              searchTerm.toLowerCase()
            )
        )
      : [];

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <DashboardLayout activePage="users">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Users className="mr-2 text-red-500" />
              System Users
            </h2>
            <p className="text-gray-600 mt-1">
              Manage farmers and other system user details
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-4 md:mt-0 relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 border-b font-semibold text-sm text-gray-700 text-left">
                  No
                </th>
                <th className="py-3 px-4 border-b font-semibold text-sm text-gray-700 text-left">
                  Profile
                </th>
                <th className="py-3 px-4 border-b font-semibold text-sm text-gray-700 text-left">
                  FullName
                </th>
                <th className="py-3 px-4 border-b font-semibold text-sm text-gray-700 text-left">
                  Email
                </th>
                <th className="py-3 px-4 border-b font-semibold text-sm text-gray-700 text-left">
                  Phone Number
                </th>
                <th className="py-3 px-4 border-b font-semibold text-sm text-gray-700 text-left">
                  Location
                </th>
                <th className="py-3 px-4 border-b font-semibold text-sm text-gray-700 text-left">
                  Results
                </th>
                <th className="py-3 px-4 border-b font-semibold text-sm text-gray-700 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-4 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <React.Fragment key={user.username || index}>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b border-gray-200">
                        {indexOfFirstUser + index + 1}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200">
                        <Image
                          src={
                            user.image_profile
                              ? getImageUrl(user.image_profile)
                              : "https://via.placeholder.com/40"
                          }
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                          width={40}
                          height={40}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/40";
                          }}
                        />
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 font-medium">
                        {user.fullname}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200">
                        {user.email}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200">
                        {user.phone_number}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200">
                        {user.district}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200">
                        {/* Result Data with count and clickable button */}
                        <button
                          onClick={() => handleGetPredictions(user.username)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                          disabled={loadingPredictions[user.username]}
                        >
                          <span className="font-medium">
                            {getPredictionCount(user.username)}
                          </span>
                          {expandedUser === user.username ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200">
                        <button
                          onClick={() => {
                            setShowUpdateUser(true);
                            setCurrentUser(user);
                          }}
                          className="text-blue-500 hover:text-blue-700 mr-3"
                        >
                          <Edit className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                    {/* Predictions Dropdown Row */}
                    {expandedUser === user.username && (
                      <tr>
                        <td
                          colSpan="8"
                          className="py-2 px-4 border-b border-gray-200 bg-gray-50"
                        >
                          <div className="p-3">
                            {loadingPredictions[user.username] ? (
                              <p className="text-gray-500 text-center">
                                Loading predictions...
                              </p>
                            ) : Array.isArray(userPredictions[user.username]) &&
                              userPredictions[user.username].length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="py-2 px-3 text-xs font-medium text-gray-700 text-left">
                                        Image
                                      </th>
                                      <th className="py-2 px-3 text-xs font-medium text-gray-700 text-left">
                                        Disease
                                      </th>
                                      <th className="py-2 px-3 text-xs font-medium text-gray-700 text-left">
                                        Confidence
                                      </th>
                                      <th className="py-2 px-3 text-xs font-medium text-gray-700 text-left">
                                        Date
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {userPredictions[user.username].map(
                                      (prediction, idx) => (
                                        <tr
                                          key={idx}
                                          className="hover:bg-gray-50"
                                        >
                                          <td className="py-2 px-3 text-sm">
                                            <Image
                                              src={
                                                prediction.image_url
                                                  ? getImageUrl(
                                                      prediction.image_url
                                                    )
                                                  : "https://via.placeholder.com/64"
                                              }
                                              alt="Prediction"
                                              className="w-16 h-16 object-cover rounded"
                                              width={64}
                                              height={64}
                                              onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                  "https://via.placeholder.com/64";
                                              }}
                                            />
                                          </td>
                                          <td className="py-2 px-3 text-sm">
                                            {prediction.class_name}
                                          </td>
                                          <td className="py-2 px-3 text-sm">
                                            {(
                                              prediction.confidence * 100
                                            ).toFixed(2)}
                                            %
                                          </td>
                                          <td className="py-2 px-3 text-sm">
                                            {new Date(
                                              prediction.created_at
                                            ).toLocaleString()}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-gray-500 text-center">
                                No prediction data available for this user.
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-4 text-center text-gray-500">
                    No users found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstUser + 1} to{" "}
              {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Update User Modal */}
      <Modal
        open={showUpdateUser}
        onCancel={() => setShowUpdateUser(false)}
        footer={null}
        title="Update User"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="bg-red-500 hover:bg-red-600 w-full"
              loading={loadingUpdate}
              disabled={loadingUpdate}
            >
              {loadingUpdate ? "Updating..." : "Update User"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  );
}
