// import Image from "next/image";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation Bar */}
     <Navbar/>

      {/* Hero Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl font-bold mb-2">Detect Tomato Plant</h1>
            <h2 className="text-3xl font-bold mb-6">Diseases Early</h2>
            <p className="text-gray-600 mb-8">
              Advanced grid computing and machine learning
              <br />
              to protect your crop and boost yields
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard">
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                Get Started
              </Button>
              </Link>
             
              <Button
                variant="outline"
                className="text-red-500 border-red-500 hover:bg-red-50"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className=" md:w-1/2 p-5 flex justify-center border rounded bg-white">
            <div className="w-64 h-64 bg-green-200 rounded-full flex items-center justify-center">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      d="M30,30 L50,50 L70,30 L50,70 L30,30"
                      fill="none"
                      stroke="#E34234"
                      strokeWidth="1"
                    />
                    <rect
                      x="30"
                      y="30"
                      width="20"
                      height="20"
                      fill="#A5D8DD"
                      opacity="0.7"
                    />
                    <circle
                      cx="30"
                      cy="30"
                      r="10"
                      fill="#F9E0C3"
                      opacity="0.7"
                    />
                    <circle
                      cx="70"
                      cy="30"
                      r="10"
                      fill="#F9E0C3"
                      opacity="0.7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <Card className=" shadow-sm border rounded-md ">
              <CardContent className="pt-6 ">
                <div className="flex mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500 font-bold">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Capture Images</h3>
                <p className="text-gray-600">
                  Using camera or upload existing photos
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border shadow-md  rounded-md">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-500 font-bold">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Analyze with Grid Computing
                </h3>
                <p className="text-gray-600">
                  Distributed processing for fast results
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border shadow-md rounded-md">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 font-bold">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Get Disease Predictions
                </h3>
                <p className="text-gray-600">
                  ML model identifies diseases accurately
                </p>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="border shadow-md rounded-md">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500 font-bold">
                    4
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Apply Targeted Solutions
                </h3>
                <p className="text-gray-600">Recommendations for treatment</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-blue-50 py-8">
        <div className="container mx-auto px-8 text-center">
          <p className="text-gray-600 italic">
            &quot;This tool helped us reduce crop loss by 27% last season by
            detecting diseases early.&quot;
          </p>
          <p className="mt-4 text-gray-500 text-sm">
            - John Parker, Green Valley Farms
          </p>
        </div>
      </section>
    </main>
  );
}
