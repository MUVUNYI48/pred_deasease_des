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
    },
  });
  const router=useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    if (data.password !== data.confirm_password) {
      alert("Passwords do not match!");
      return;
    }
    setIsLoading(true);
      const registerData={
        fullname: data.fullname,
        username: data.username,
        password: data.password,
        email: data.email,
        confirm_password: data.confirm_password,
      };
    
      try{
      const result=await(registerUser(registerData));
      console.log("Signup response:", result);
      alert("signing up successfull");
      router.push("/login");
        }
        catch(error){
          setIsLoading(false);
          if (axios.isAxiosError(error)) {
            console.error("Axios error details:", error.toJSON());
            alert("signing up failed: " + error.message);
          } else {
            console.error("Non-Axios error:", error);
            alert("Unknown error during signup.");
          }
        }        
        finally{
          setIsLoading(false);
        }
    };


  return (
    <>    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    
      <div className="max-w-md w-full space-y-8 border bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign up to get started</p>
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
                    <Input
                      type="text"
                      placeholder="farmer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              rules={{ required: "Email is required" }}
              render={({ field }) => (
                <FormItem>
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
              name="username"
              rules={{ required: "Username is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="username"
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
                <FormItem>
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
              rules={{ required: "password is required and they must be matching!" }}
              render={({ field }) => (
                <FormItem>
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

            <Button type="submit" className="w-full bg-red-500" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-lg capitalize">
            <span className="bg-white px-2 text-muted-foreground">
              Remember Account
            </span>
          </div>
        </div>

       <a className="text-blue-500 text-xl text-center flex justify-center" href="/login"> Signin here  <ArrowRight className="mt-1" size={23}/></a> 
      </div>
    </div>
    </>
  );
}
