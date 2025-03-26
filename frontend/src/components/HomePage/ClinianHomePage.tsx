"use client";

import useUser from "@/hooks/useUser";
import { Oleo_Script } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const oleo = Oleo_Script({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
});

export default function ClinianHomePage() {
  const date = new Date();
  // Format date string as "Month Day"
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  const dateStr = `${month} ${day}`;
  
  // State variables
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [pendingCases, setPendingCases] = useState([
    { id: 1, patientName: "John Doe", symptoms: "Fever, headache, fatigue", submittedAt: "2 hours ago", priority: "medium" },
    { id: 2, patientName: "Jane Smith", symptoms: "Chest pain, shortness of breath", submittedAt: "45 minutes ago", priority: "high" },
    { id: 3, patientName: "Robert Johnson", symptoms: "Rash, itching", submittedAt: "3 hours ago", priority: "low" }
  ]);
  const [filter, setFilter] = useState("all");
  
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle authentication
  const { user, setUser } = useUser();

  useEffect(() => {
    if (!user || user.role !== 'clinician') {
      router.push('/');
    }
  }, [user, router]);

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

  // Filter cases by priority
  const filteredCases = filter === "all" 
    ? pendingCases 
    : pendingCases.filter(c => c.priority === filter);

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
                <Link href={`/home`}>
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
                    <img 
                      src={user.pfpUrl} 
                      alt="Profile" 
                      className="h-10 w-10 object-cover"
                    />
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
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </div>
                    </Link>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setUser(null);
                        toast.success("Successfully signed out");
                        router.push('/auth');
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
          {/* Main content column - now full width since we removed the side column */}
          <div className="mx-auto">
            {/* Gradient welcome card */}
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
              <div className="relative z-10 text-white">
                <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4 drop-shadow-sm">
                  Welcome, Dr. {user?.displayName}
                </h1>
                <p className="text-lg md:text-2xl opacity-90 drop-shadow-sm max-w-2xl">
                  You have {pendingCases.length} pending patient cases to review
                </p>
              </div>
            </div>

            {/* Pending Cases Section */}
            <div className="bg-white rounded-xl shadow-md p-4 md:p-8 transition-all hover:shadow-lg">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Pending Patient Cases
                </h2>
                
                {/* Filter dropdown */}
                <div className="relative">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                  >
                    <option value="all">All Cases</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>
              
              {/* Case list */}
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
                          Submitted
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCases.map((caseItem) => (
                        <tr key={caseItem.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium">
                                  {caseItem.patientName.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{caseItem.patientName}</div>
                              </div>
                            </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{caseItem.symptoms}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{caseItem.submittedAt}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${caseItem.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                  caseItem.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-green-100 text-green-800'}`}>
                                {caseItem.priority.charAt(0).toUpperCase() + caseItem.priority.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => {
                                  // Navigate to case review page in a real implementation
                                  toast.info(`Reviewing case for ${caseItem.patientName}`);
                                }}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                Review
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {filteredCases.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No pending cases match your current filter.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}