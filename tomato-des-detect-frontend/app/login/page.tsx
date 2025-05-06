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
import { useState } from "react";
import Navbar from "@/components/navbar";
import { loginUser } from "@/redux-fetch-endpoints/auth-redux";

export default function LoginPage() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    // Perform login logic here
    setIsLoading(true);
    console.log("Login Data:", data);
    const loginData = {
      email: data.email,
      password: data.password,
    }
    try{
      const result=await loginUser(loginData);
      console.log("Login response:", result);
        window.location.href="/DashboardLoyout";
      
    }
    catch(error){
      setIsLoading(false);
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    }
    setIsLoading(false);
   
  };

  return (
  <>
  <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 border bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground text-sm mt-1">Login to your account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 ">
            <FormField
              control={form.control}
              name="email"
              rules={{ required: "Email is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      {...field}
                      disabled={isLoading}
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
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-red-500" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        

        </Form>

        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-lg ">
            <span className="bg-white px-2 text-muted-foreground">
              Don&apos;t have an account?{" "}
            </span>
          </div>
        </div>
          <a variant="outline" className="w-full flex justify-center text-lg text-blue-500" disabled={isLoading} href="/signup">
            Signup here 
            <ArrowRight className="ml-1 mt-1" size={23} />
     </a>
      

      </div>
    </div>
    </>
  );
}
