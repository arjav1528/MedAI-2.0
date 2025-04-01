"use client";

import { Oleo_Script } from "next/font/google";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { retriveData } from "@/lib/Firebase/firestore";
import { User, Query } from "@/lib/models";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

const oleo = Oleo_Script({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
});

export default function PatientProfilePage() {
  // Animation state
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [pendingQueries, setPendingQueries] = useState<Query[]>([]);
  const [answeredQueries, setAnsweredQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Effect for animation on load
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const {user} = useAuth();
  useEffect(() => {
    if(!user) router.push('/auth');
  }, [user]);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // For demo purposes, we'll use a hardcoded ID
        // In a real app, you'd get this from auth context or URL params
        const userId = user?.googleId || ""; // Replace with actual user ID
        const response = await retriveData("users", userId);
        
        // Check if the response is defined first
        if (!response) {
          console.error("No response received from database");
          toast.error("Failed to load profile data");
          return;
        }
        
        const { result, error } = response;
        
        if (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load profile data");
          return;
        }
        
        if (result) {
          setUserData(result as User);
          
          // Separate queries into pending and answered
          const pending: Query[] = [];
          const answered: Query[] = [];
          
          if (Array.isArray((result as User).queries)) {
            (result as User).queries.forEach((query: Query) => {
              if (query.response) {
                answered.push(query);
              } else {
                pending.push(query);
              }
            });
          } else {
            console.warn("User data doesn't contain a queries array");
          }
          
          setPendingQueries(pending);
          setAnsweredQueries(answered);
        }
      } catch (err) {
        console.error("Error in data fetching:", err);
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle clicks outside of profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && 
          !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownRef]);

  const handleSignOut = () => {
    
    toast.success("Successfully signed out");
    router.push('/auth');
  };

  // Use fetched data or fallbacks if not available
  const displayPendingQueries = pendingQueries;
  const displayAnsweredQueries = answeredQueries;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Navigation Bar */}
      <div className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-15">
            {/* Logo */}
            <div className="flex items-center my-auto">
              <Link href={`/`}>
                <h1 className={`${oleo.className}`} style={{ fontSize: '40px', fontWeight: 'bold', marginBottom: '16px' }}>
                  <span style={{ color: '#064579' }}>Med</span>
                  <span style={{ color: '#50C878' }}>AI</span>
                </h1>
              </Link>
            </div>
            
            {/* Profile dropdown */}
            <div className="flex items-center space-x-3">
              <div className="relative" ref={profileDropdownRef}>
                <button 
                  className="rounded-full text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-200 transition-colors overflow-hidden cursor-pointer"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <div className="p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </button>
                
                {/* Profile dropdown menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                    <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                      </div>
                    </Link>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleSignOut}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 md:pt-24 pb-10 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div
            className={`relative rounded-xl shadow-lg overflow-hidden p-6 md:p-10 mb-8 transition-all duration-700 transform ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)'
            }}
          >
            {/* Animated overlay patterns */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-gradient-x" 
                style={{backgroundSize: '200% 200%'}}></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
            
            {/* Decorative circles */}
            <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
            <div className="absolute bottom-5 left-5 w-16 h-16 rounded-full bg-white/10 blur-md"></div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="h-24 w-24 md:h-32 md:w-32 bg-white rounded-full overflow-hidden border-4 border-white shadow-md">
                <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-500">
                  {userData?.pfpUrl ? (
                    <img 
                      src={userData.pfpUrl} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="text-white text-center md:text-left">
                <h1 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-sm">
                  {userData?.displayName || "Sarah Johnson"}
                </h1>
                <p className="opacity-90 md:text-lg">
                  {userData?.email || "sarah.johnson@example.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white rounded-xl shadow-md p-8 mb-8 text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-slate-200 h-10 w-10 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <p className="mt-4 text-gray-500">Loading queries...</p>
              </div>
            </div>
          )}

          {/* Tab Content - Only show when not loading */}
          {!isLoading && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              {/* Queries Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Health Queries History</h2>
                  
                  {/* Pending Queries */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pending Queries ({displayPendingQueries.length})
                    </h3>
                    
                    <div className="space-y-3">
                      {displayPendingQueries.length === 0 ? (
                        <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                          No pending health queries
                        </div>
                      ) : (
                        displayPendingQueries.map((query, index) => (
                          <div key={index} className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg">
                            <div className="flex justify-between">
                              <div className="font-medium text-gray-800">{query.symptoms}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(query.time).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Body temperature:</span> {query.bodyTemperature}
                            </div>
                            {query.additionalInfo && (
                              <div className="mt-1 text-sm text-gray-600">
                                <span className="font-medium">Additional info:</span> {query.additionalInfo}
                              </div>
                            )}
                            <div className="mt-2 flex items-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <svg className="mr-1.5 h-2 w-2 text-yellow-400" fill="currentColor" viewBox="0 0 8 8">
                                  <circle cx="4" cy="4" r="3" />
                                </svg>
                                Awaiting Response
                              </span>
                              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Priority: {query.priority}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  {/* Answered Queries */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Answered Queries ({displayAnsweredQueries.length})
                    </h3>
                    
                    <div className="space-y-3">
                      {displayAnsweredQueries.length === 0 ? (
                        <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                          No answered health queries
                        </div>
                      ) : (
                        displayAnsweredQueries.map((query, index) => (
                          <div key={index} className="bg-green-50 border border-green-100 p-4 rounded-lg">
                            <div className="flex justify-between">
                              <div className="font-medium text-gray-800">{query.symptoms}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(query.time).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Response:</span> {query.response}
                            </div>
                            <div className="mt-2 flex items-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg className="mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                                  <circle cx="4" cy="4" r="3" />
                                </svg>
                                Answered
                              </span>
                              {query.isVerified && (
                                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                  </svg>
                                  Clinically Verified
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SOS Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-5 rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm8-8a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          SOS
        </button>
      </div>
    </>
  );
}