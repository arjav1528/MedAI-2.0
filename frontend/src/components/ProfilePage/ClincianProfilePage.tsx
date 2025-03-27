"use client";

import { useAuth } from "@/lib/AuthContext";
import { User, Query } from "@/lib/models";
import { auth } from "@/lib/Firebase/firebase";
import { signOut } from "firebase/auth";
import { Oleo_Script } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/Firebase/firebase";

const oleo = Oleo_Script({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
});

export default function ClinicianProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // State variables
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [maxQueries, setMaxQueries] = useState(user?.maxQueries || 5);
  const [isUpdatingMaxQueries, setIsUpdatingMaxQueries] = useState(false);
  
  // Sample recent queries - this would be filtered from user.queries in a real implementation
  const [recentQueries, setRecentQueries] = useState<Array<{
    id: number;
    patientName: string;
    symptoms: string;
    time: string;
    status: string;
  }>>([
    { id: 1, patientName: "Jane Smith", symptoms: "Fever, headache, fatigue", time: "Today, 10:35 AM", status: "Resolved" },
    { id: 2, patientName: "Robert Johnson", symptoms: "Chest pain, shortness of breath", time: "Yesterday, 3:15 PM", status: "In Progress" },
    { id: 3, patientName: "Michael Brown", symptoms: "Rash, itching", time: "March 24, 2025", status: "Pending" },
    { id: 4, patientName: "Emily Davis", symptoms: "Sore throat, cough", time: "March 23, 2025", status: "Resolved" },
    { id: 5, patientName: "David Wilson", symptoms: "Back pain, stiffness", time: "March 22, 2025", status: "In Progress" }
  ]);
  
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(user === null){
      router.push("/auth");
    }
    else if(user.role === 'patient'){
      router.push("/patient");
    } else {
      setMaxQueries(user.maxQueries || 5);
    }
  }, [user, router]);

  const handleSignOut = async () => {
    try{
      await signOut(auth);
      router.push("/auth");
    }catch(err){
      console.error(err);
    }
  };

  const handleUpdateMaxQueries = async () => {
    if (!user) return;
    
    setIsUpdatingMaxQueries(true);
    try {
      // Update the maxQueries in Firebase
      
      toast.success("Maximum queries updated successfully");
    } catch (error) {
      console.error("Error updating max queries:", error);
      toast.error("Failed to update maximum queries");
    } finally {
      setIsUpdatingMaxQueries(false);
    }
  };

  useEffect(() => {
    // Animation trigger
    setIsLoaded(true);
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

  // Stats for the clinician
  const totalCases = user?.queries?.length || 0;
  const resolvedCases = user?.queries?.filter(q => q.isVerified).length || 0;
  const pendingCases = totalCases - resolvedCases;
  const responseRate = totalCases > 0 ? Math.round((resolvedCases / totalCases) * 100) : 0;

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
                <Link href={`/clinician`}>
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
                  {user?.pfpUrl ? (
                    <img src={user.pfpUrl} alt="Profile" className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className="p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </button>
                
                {/* Profile dropdown menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                    <Link href="/clinician" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                      </div>
                    </Link>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={async () => {
                        await handleSignOut()
                      }}
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
          <div className="mx-auto">
            {/* Profile Header */}
            <div
              className={`relative rounded-xl shadow-lg overflow-hidden p-6 md:p-10 mb-8 transition-all duration-700 transform ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{
                background: 'linear-gradient(135deg, #064579 0%, #10b981 100%)'
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
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="h-32 w-32 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden border-4 border-white/30">
                      {user?.pfpUrl ? (
                        <img src={user.pfpUrl} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-white text-center md:text-left">
                  <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 drop-shadow-sm">
                    Dr. {user?.displayName || "Clinician"}
                  </h1>
                  <p className="text-lg opacity-90 drop-shadow-sm">
                    {user?.email || "doctor@example.com"}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                      Telemedicine
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                      Primary Care
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                      {resolvedCases} Cases Resolved
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Profile Information and Query Settings */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8 transition-all hover:shadow-lg mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg md:text-2xl font-semibold text-gray-800 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 md:h-7 md:w-7 mr-2 md:mr-3 text-blue-500 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile Information
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                      <div>
                        <h3 className="text-sm text-gray-500 font-medium">Full Name</h3>
                        <p className="text-gray-900">Dr. {user?.displayName || "Clinician"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm text-gray-500 font-medium">Email</h3>
                        <p className="text-gray-900">{user?.email || "doctor@example.com"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm text-gray-500 font-medium">Role</h3>
                        <p className="text-gray-900 capitalize">{user?.role || "Clinician"}</p>
                      </div>
                      
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm text-gray-500 font-medium mb-3">Maximum Queries Per Patient</h3>
                      <div className="flex items-center space-x-4">
                        <div className="relative w-36">
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={maxQueries}
                            onChange={(e) => setMaxQueries(parseInt(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                          />
                        </div>
                        <button
                          onClick={handleUpdateMaxQueries}
                          disabled={isUpdatingMaxQueries}
                          className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition-all font-medium shadow-sm hover:shadow-md ${
                            isUpdatingMaxQueries ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                          }`}
                        >
                          {isUpdatingMaxQueries ? 'Updating...' : 'Update'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Set the maximum number of queries patients can submit to you. This helps manage your workload.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Recent Activity Based on Queries */}
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8 transition-all hover:shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg md:text-2xl font-semibold text-gray-800 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 md:h-7 md:w-7 mr-2 md:mr-3 text-blue-500 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Recent Patient Queries
                    </h2>
                  </div>
                  
                  <div className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Patient
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Symptoms
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {recentQueries.map((query) => (
                            <tr key={query.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{query.patientName}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">{query.symptoms}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{query.time}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${query.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                                    query.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-blue-100 text-blue-800'}`}>
                                  {query.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {recentQueries.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                      No recent queries to display.
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Column - Stats and Help */}
              <div className="space-y-8">
                {/* Performance Card */}
                <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Performance Metrics
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-600">Cases Resolved</span>
                        <span className="text-sm font-medium text-blue-600">{resolvedCases} of {totalCases}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${resolvedCases && totalCases ? (resolvedCases / totalCases) * 100 : 0}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{responseRate}% completion rate</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-600">Pending Cases</span>
                        <span className="text-sm font-medium text-yellow-600">{pendingCases}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${pendingCases && totalCases ? (pendingCases / totalCases) * 100 : 0}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Waiting for your review</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-600">Maximum Allowed Queries</span>
                        <span className="text-sm font-medium text-purple-600">{maxQueries}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Per patient limit</p>
                    </div>
                  </div>
                </div>
                
                {/* Help & Support */}
                <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Help & Support
                  </h2>
                  
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Contact Support
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}