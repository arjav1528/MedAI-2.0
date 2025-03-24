"use client";

import { redirect } from "next/navigation";



import { useState, useEffect } from "react";
import Layout from "../layout";
import QueryForm from "@/components/PatientPage/QueryForm";
import QueryList from "@/components/PatientPage/QueryList";
import SOSButton from "@/components/PatientPage/SOSButton";

export default function HomePage() {

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-blue-200 mb-4"></div>
          <div className="h-4 w-48 bg-blue-200 rounded"></div>
        </div>
      </div>
    );
  }

 

  // Check if the user is a clinician (any role other than PATIENT)
  

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8 relative bg-gradient-to-b from-white to-blue-50 rounded-2xl">
        {/* Hero section with animated sliding gradient */}
        <div
          className={`relative rounded-xl shadow-lg overflow-hidden p-6 mb-8 transition-all duration-700 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {/* The animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 background-animate"></div>

          {/* Content with proper contrast */}
          <div className="relative z-10 text-white">
            <h1 className="text-4xl font-bold mb-3 drop-shadow-sm">
              Hello!
            </h1>
            <p className="text-xl opacity-90 drop-shadow-sm">
              How can I assist with your health today?
            </p>
          </div>
        </div>

        {/* Query form section - with animation */}
        <div
          className={`transition-all duration-700 delay-200 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 mr-3 text-blue-500 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              Ask a Health Question
            </h2>
            
            {/* Added container with proper padding and spacing */}
            <div className="overflow-hidden px-1">
              <QueryForm />
            </div>
            
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-5">
                Your Health Queries
              </h2>
              <QueryList />
            </div>
          </div>
        </div>

        <SOSButton />
      </div>
    </Layout>
  );
}