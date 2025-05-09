"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import Navbar from "@/components/navbar";
import { registerUser } from "@/redux-fetch-endpoints/auth-redux";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupPage() {
  const form = useForm({
    defaultValues: {
      fullname: "",
      username: "",
      confirm_password: "",
      password: "",
      email: "",
      phone_number: "",
      image_profile: "",
      district: "",
    },
  });
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
    }
  };
  const onSubmit = async (data) => {
    if (data.password !== data.confirm_password) {
      alert("Passwords do not match!");
      return;
    }
    if (!selectedFile) {
      alert("Please select a profile picture!");
      return;
    }
    setIsLoading(true);
  
    // Add debugging to see what kind of file object we're dealing with
    console.log("Selected file type:", Object.prototype.toString.call(selectedFile));
    console.log("Selected file properties:", Object.keys(selectedFile));
    console.log("Selected file name:", selectedFile.name);
    console.log("Selected file size:", selectedFile.size);
  
    const registerData = {
      fullname: data.fullname,
      username: data.username,
      email: data.email,
      district: data.district,
      phone_number: data.phone_number,
      image_profile: selectedFile, // This should be a File object from the input
      password: data.password,
      confirm_password: data.confirm_password,
    };
  
    try {
      // Added debugging before API call
      console.log("About to call registerUser with data:", {
        ...registerData,
        image_profile: registerData.image_profile ? `File: ${registerData.image_profile.name}` : 'No file',
        password: '***', // Don't log actual password
        confirm_password: '***'
      });
      
      const result = await registerUser(registerData);
      console.log("Signup response:", result);
      alert("signing up successful");
      router.push("/login");
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.toJSON());
        // Show more useful error information if available
        if (error.response && error.response.data) {
          alert("Signup failed: " + JSON.stringify(error.response.data));
        } else {
          alert("Signup failed: " + error.message);
        }
      } else {
        console.error("Non-Axios error:", error);
        alert("Unknown error during signup.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {" "}
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 border bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Sign up to get started
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="fullname"
                rules={{ required: "Full name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="farmer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                rules={{ required: "Username is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="place username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  rules={{ required: "Email is required" }}
                  render={({ field }) => (
                    <FormItem className="my-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
                  rules={{ required: "Phone number is required" }}
                  render={({ field }) => (
                    <FormItem className="my-2">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="+250 ...." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* The next is about profile picture, */}

                <FormField
                  control={form.control}
                  name="image_profile"
                  rules={{ required: "Profile Picture is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => {
                            field.onChange(e);
                            handleFileChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* The following is about location */}
                <FormField
                  control={form.control}
                  name="district"
                  rules={{ required: "Location is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter district location"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  rules={{ required: "Password is required" }}
                  render={({ field }) => (
                    <FormItem className="my-2">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirm_password"
                  rules={{
                    required: "password is required and they must be matching!",
                  }}
                  render={({ field }) => (
                    <FormItem className="my-2">
                      <FormLabel>Confirm_password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-red-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-2 w-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>

          <a
            className="text-blue-500 text-lg text-center flex justify-center"
            href="/login"
          >
            {" "}
            Signin here <ArrowRight className="mt-1" size={20} />
          </a>
        </div>
      </div>
    </>
  );
}
