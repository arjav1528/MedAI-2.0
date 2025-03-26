"use client";

import useUser from "@/hooks/useUser";
import { Oleo_Script } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const oleo = Oleo_Script({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
});

export default function HomePagePatient() {
  const date = new Date();
  const time = date.getHours();
  //get me a string which displays 'month date'
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  const dateStr = `${month} ${day}`;
  // Define all state variables at the top
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isListeningSymptoms, setIsListeningSymptoms] = useState(false);
  const [isListeningInfo, setIsListeningInfo] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  
  // References for speech recognition
  const recognitionSymptoms = useRef<any>(null);
  const recognitionInfo = useRef<any>(null);
  const router = useRouter();

  // Handle authentication redirect in useEffect
  const {user,setUser} = useUser()

  useEffect(() => {
    if(!user){
      router.push('/auth');
    }
  },[user,router]);
  

  useEffect(() => {
    // Animation trigger
    setIsLoaded(true);
    
    // Initialize speech recognition if available
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        // Setup for symptoms
        recognitionSymptoms.current = new SpeechRecognition();
        recognitionSymptoms.current.continuous = true;
        recognitionSymptoms.current.interimResults = true;
        recognitionSymptoms.current.lang = 'en-US';
        
        recognitionSymptoms.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join('');
          
          setSymptoms(transcript);
        };
        
        recognitionSymptoms.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListeningSymptoms(false);
        };
        
        // Setup for additional info
        recognitionInfo.current = new SpeechRecognition();
        recognitionInfo.current.continuous = true;
        recognitionInfo.current.interimResults = true;
        recognitionInfo.current.lang = 'en-US';
        
        recognitionInfo.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join('');
          
          setAdditionalInfo(transcript);
        };
        
        recognitionInfo.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListeningInfo(false);
        };
      }
    }
    
    // Cleanup
    return () => {
      if (recognitionSymptoms.current) {
        try {
          recognitionSymptoms.current.stop();
        } catch (error) {
          // Ignore errors during cleanup
        }
      }
      if (recognitionInfo.current) {
        try {
          recognitionInfo.current.stop();
        } catch (error) {
          // Ignore errors during cleanup
        }
      }
    };
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

  // Toggle speech recognition functions
  const toggleListeningSymptoms = () => {
    if (isListeningSymptoms) {
      recognitionSymptoms.current.stop();
    } else {
      try {
        recognitionSymptoms.current.start();
      } catch (error) {
        console.error("Speech recognition error:", error);
      }
    }
    setIsListeningSymptoms(!isListeningSymptoms);
  };
  
  const toggleListeningInfo = () => {
    if (isListeningInfo) {
      recognitionInfo.current.stop();
    } else {
      try {
        recognitionInfo.current.start();
      } catch (error) {
        console.error("Speech recognition error:", error);
      }
    }
    setIsListeningInfo(!isListeningInfo);
  };

  // Mock user data
  

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

      {/* Responsive Navigation Bar - Small version with only logo and icons */}
      <div className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        {/* Navigation Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo and icons container - reduced height */}
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
            
            {/* Icons container */}
            <div className="flex items-center space-x-3">
              {/* Profile icon with dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button 
                  className="p-1 rounded-full text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-200 transition-colors"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
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

      {/* Adjust the top padding in the main content to match smaller navbar */}
      <div className="pt-20 md:pt-24 pb-10 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:gap-6">
            {/* Main content column */}
            <div className="md:w-3/4 mx-auto">
              {/* Gradient hello card */}
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
                <div className="relative z-10 text-white">
                  <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4 drop-shadow-sm">
                    Hello, {user?.displayName} !
                  </h1>
                  <p className="text-lg md:text-2xl opacity-90 drop-shadow-sm max-w-2xl">
                    How can I assist with your health today?
                  </p>
                </div>
              </div>

              {/* Health question form */}
              <div className="bg-white rounded-xl shadow-md p-4 md:p-8 transition-all hover:shadow-lg">
                <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center">
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
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  Ask a Health Question
                </h2>
                
                <div className="overflow-hidden">
                  <div className="mt-2 max-w-2xl mx-auto">
                    <form className="space-y-4">
                      {/* Symptoms field */}
                      <div className="space-y-2">
                        <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
                          Enter your symptoms
                        </label>
                        <div className="relative">
                          <input 
                            type="text" 
                            id="symptoms"
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10 text-black"
                            placeholder="E.g., headache, fever, cough, etc."
                          />
                          <button 
                            type="button"
                            onClick={toggleListeningSymptoms}
                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full ${isListeningSymptoms ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          </button>
                        </div>
                        {isListeningSymptoms && (
                          <div className="text-xs text-blue-500 animate-pulse flex items-center">
                            <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-2"></span> 
                            Listening... Speak your symptoms clearly
                          </div>
                        )}
                      </div>
                      
                      {/* Body temperature row */}
                      <div className="space-y-2">
                        <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                          Body temperature (if applicable)
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                          <input 
                            type="text" 
                            id="temperature"
                            className="w-20 md:w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                            placeholder="98.6"
                          />
                          <select 
                            className="px-2 md:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-black"
                          >
                            <option value="fahrenheit">°F</option>
                            <option value="celsius">°C</option>
                          </select>
                          <div className="text-xs text-gray-500">
                            Normal: 97.8°F-99°F / 36.5°C-37.2°C
                          </div>
                        </div>
                      </div>
                      
                      {/* Duration field */}
                      <div className="space-y-2">
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                          Since when are you facing symptom(s)?
                        </label>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-flex items-center">
                            <input 
                              type="radio" 
                              id="duration-today" 
                              name="duration" 
                              value="today"
                              className="h-4 w-4 text-blue-600"
                            />
                            <label htmlFor="duration-today" className="ml-2 text-sm text-gray-700">Today</label>
                          </div>
                          <div className="inline-flex items-center">
                            <input 
                              type="radio" 
                              id="duration-days" 
                              name="duration" 
                              value="few-days"
                              className="h-4 w-4 text-blue-600"
                            />
                            <label htmlFor="duration-days" className="ml-2 text-sm text-gray-700">Few days</label>
                          </div>
                          <div className="inline-flex items-center">
                            <input 
                              type="radio" 
                              id="duration-week" 
                              name="duration" 
                              value="week"
                              className="h-4 w-4 text-blue-600"
                            />
                            <label htmlFor="duration-week" className="ml-2 text-sm text-gray-700">About a week</label>
                          </div>
                          <div className="inline-flex items-center">
                            <input 
                              type="radio" 
                              id="duration-weeks" 
                              name="duration" 
                              value="several-weeks"
                              className="h-4 w-4 text-blue-600"
                            />
                            <label htmlFor="duration-weeks" className="ml-2 text-sm text-gray-700">Several weeks</label>
                          </div>
                          <div className="inline-flex items-center">
                            <input 
                              type="radio" 
                              id="duration-month" 
                              name="duration" 
                              value="month-plus"
                              className="h-4 w-4 text-blue-600"
                            />
                            <label htmlFor="duration-month" className="ml-2 text-sm text-gray-700">Month or longer</label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Additional information field */}
                      <div className="space-y-2">
                        <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
                          Additional information
                        </label>
                        <div className="relative">
                          <textarea 
                            id="additionalInfo"
                            rows={3}
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10 text-black"
                            placeholder="Any other relevant details about your condition, medical history, medications, etc."
                          ></textarea>
                          <button 
                            type="button"
                            onClick={toggleListeningInfo}
                            className={`absolute right-2 top-4 p-1.5 rounded-full ${isListeningInfo ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          </button>
                        </div>
                        {isListeningInfo && (
                          <div className="text-xs text-blue-500 animate-pulse flex items-center">
                            <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-2"></span> 
                            Listening... Speak clearly about additional information
                          </div>
                        )}
                      </div>
                      
                      {/* Submit button with toast handling */}
                      <div className="mt-6 flex justify-center">
                        <button 
                          type="submit"
                          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md hover:scale-105 flex items-center cursor-pointer"
                          onClick={(e) => {
                            // Prevent default form submission
                            e.preventDefault();
                            
                            // Trim the symptoms to handle spaces-only input
                            const symptomsValue = symptoms.trim();
                            
                            if(!symptomsValue) {
                              toast.error('Please enter your symptoms');
                              return;
                            }
                            
                            // Get the selected radio button value
                            const selectedRadio = document.querySelector('input[name="duration"]:checked') as HTMLInputElement;
                            const durationValue = selectedRadio ? selectedRadio.value : null;
                            
                            // Collect form data
                            const formData = {
                              symptoms: symptomsValue,
                              temperature: (document.getElementById('temperature') as HTMLInputElement)?.value || null,
                              temperatureUnit: (document.querySelector('select') as HTMLSelectElement)?.value || 'fahrenheit',
                              duration: durationValue,
                              additionalInfo: additionalInfo.trim()
                            };
                            
                            console.log('Form data:', formData);
                            
                            // Show success toast and reset form
                            toast.success('Your health question has been submitted successfully');
                            
                            // Reset form fields
                            setSymptoms("");
                            setAdditionalInfo("");
                            
                            // Reset other form elements
                            if (document.getElementById('temperature') as HTMLInputElement) {
                              (document.getElementById('temperature') as HTMLInputElement).value = '';
                            }
                            
                            if (selectedRadio) {
                              selectedRadio.checked = false;
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                          Submit Health Question
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                
                {/* How It Works section */}
                <div className="mt-10 md:mt-12 max-w-3xl mx-auto">
                  <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-3">How It Works</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-2">1</div>
                        <h4 className="font-medium">Ask a Question</h4>
                      </div>
                      <p className="text-sm text-gray-600">Enter any health-related question you'd like answered by our AI system.</p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-2">2</div>
                        <h4 className="font-medium">AI Analysis</h4>
                      </div>
                      <p className="text-sm text-gray-600">Our advanced AI analyzes your question and prepares a comprehensive response.</p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-2">3</div>
                        <h4 className="font-medium">Clinician Review</h4>
                      </div>
                      <p className="text-sm text-gray-600">A healthcare professional reviews the AI response for accuracy before delivery.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Health Tip of the Day (hidden on mobile) */}
            <div className="hidden md:block md:w-1/4 mt-6 md:mt-0">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Health Tip of the Day
                </h2>
                
                <div className="rounded-lg overflow-hidden border border-blue-100">
                  <div className="bg-blue-50 p-1 text-center">
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">{dateStr}</span>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 text-lg">Stay Hydrated</h3>
                    <p className="text-gray-600 mt-2">
                      Drinking adequate water daily helps maintain body temperature, lubricate joints, 
                      and remove waste. Aim for 8 glasses (about 2 liters) of water daily, and 
                      more during exercise or hot weather.
                    </p>
                    
                    <div className="mt-4 flex items-center text-sm text-blue-600">
                      
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <button className="text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center mx-auto">
                    
                  </button>
                </div>
              </div>
            </div>
          </div>
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
