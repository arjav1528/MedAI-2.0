"use client";

import { useState, useEffect, useRef } from "react";
import RootLayout from "../layout";
import { toast,  ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Add state for speech recognition
  const [isListeningSymptoms, setIsListeningSymptoms] = useState(false);
  const [isListeningInfo, setIsListeningInfo] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  
  // References for the speech recognition objects
  const recognitionSymptoms = useRef<any>(null);
  const recognitionInfo = useRef<any>(null);

  

  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
    
    // Initialize speech recognition if available in the browser
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      // Setup for symptoms
      recognitionSymptoms.current = new SpeechRecognition();
      recognitionSymptoms.current.continuous = true;
      recognitionSymptoms.current.interimResults = true;
      
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
    
    // Cleanup
    return () => {
      if (recognitionSymptoms.current) {
        recognitionSymptoms.current.stop();
      }
      if (recognitionInfo.current) {
        recognitionInfo.current.stop();
      }
    };
  }, []);
  
  // Functions to toggle speech recognition
  const toggleListeningSymptoms = () => {
    if (isListeningSymptoms) {
      recognitionSymptoms.current.stop();
    } else {
      recognitionSymptoms.current.start();
    }
    setIsListeningSymptoms(!isListeningSymptoms);
  };
  
  const toggleListeningInfo = () => {
    if (isListeningInfo) {
      recognitionInfo.current.stop();
    } else {
      recognitionInfo.current.start();
    }
    setIsListeningInfo(!isListeningInfo);
  };

  // Mock user data for UI purposes
  const mockUser = {
    name: "Alex"
  };

  return (
    <RootLayout>

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


      {/* Desktop Navigation - hidden on mobile */}
      <div className="hidden md:block bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                MedAI
              </div>
            </div>
            <nav className="flex space-x-8">
              <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors">Dashboard</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors">History</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors">Resources</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors">Profile</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile navigation - hidden on desktop */}
      <div className="md:hidden bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="px-4 py-2 flex justify-between items-center">
          <div className="text-xl font-bold text-blue-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            MedAI
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-md">
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-blue-600">Dashboard</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600">History</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600">Resources</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600">Profile</a>
          </div>
        )}
      </div>

      {/* Main Content - Adjusted for desktop and mobile */}
      <div className="pt-16 md:pt-24 pb-10 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:gap-6">
            {/* Main content - now wider */}
            <div className="md:w-3/4 mx-auto">
              {/* Enhanced gradient hello card */}
              <div
                className={`relative rounded-xl shadow-lg overflow-hidden p-8 md:p-10 mb-8 transition-all duration-700 transform ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)'
                }}
              >
                {/* Animated overlay patterns */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent background-animate" 
                    style={{backgroundSize: '200% 200%'}}></div>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </div>
                
                {/* Decorative circles */}
                <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
                <div className="absolute bottom-5 left-5 w-16 h-16 rounded-full bg-white/10 blur-md"></div>
                
                {/* Content with proper contrast */}
                <div className="relative z-10 text-white">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-sm">
                    Hello, {mockUser.name}!
                  </h1>
                  <p className="text-xl md:text-2xl opacity-90 drop-shadow-sm max-w-2xl">
                    How can I assist with your health today?
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-5 md:p-8 transition-all hover:shadow-lg">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 md:h-7 md:w-7 mr-3 text-blue-500 flex-shrink-0"
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
                  <div className="mt-2 max-w-2xl mx-auto"> {/* Kept narrower with max-w-2xl */}
                    <form className="space-y-4">
                      {/* Symptoms field */}
                      <div className="space-y-2">
                        <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
                          Enter your symptoms <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input 
                            type="text" 
                            id="symptoms"
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10 text-black"
                            placeholder="E.g., headache, fever, cough, etc."
                            required
                          />
                          <button 
                            type="button"
                            onClick={toggleListeningSymptoms}
                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full ${isListeningSymptoms ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          </button>
                        </div>
                        {isListeningSymptoms && (
                          <div className="text-xs text-red-500 animate-pulse flex items-center">
                            <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-2"></span> 
                            Listening... Speak your symptoms clearly
                          </div>
                        )}
                      </div>
                      
                      {/* Body temperature row */}
                      <div className="space-y-2">
                        <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                          Body temperature (if applicable)
                        </label>
                        <div className="flex items-center">
                          <input 
                            type="text" 
                            id="temperature"
                            step="0.1"
                            min="95"
                            max="110"
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                            placeholder="98.6"
                          />
                          <select 
                            className="ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-black"
                          >
                            <option value="fahrenheit">°F (Fahrenheit)</option>
                            <option value="celsius">°C (Celsius)</option>
                          </select>
                          <div className="ml-4 text-xs text-gray-500">
                            Normal: 97.8°F - 99°F / 36.5°C - 37.2°C
                          </div>
                        </div>
                      </div>
                      
                      {/* Duration field */}
                      <div className="space-y-2">
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                          Since when are you facing symptom(s)? <span className="text-red-500">*</span>
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
                            className={`absolute right-2 top-4 p-1.5 rounded-full ${isListeningInfo ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          </button>
                        </div>
                        {isListeningInfo && (
                          <div className="text-xs text-red-500 animate-pulse flex items-center">
                            <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-2"></span> 
                            Listening... Speak clearly about additional information
                          </div>
                        )}
                      </div>
                      
                      {/* Submit button with improved toast handling */}
                      <div className="mt-6 flex justify-center">
                        <button 
                          type="submit"
                          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md hover:scale-105 flex items-center cursor-pointer"
                          onClick={(e) => {
                            // Prevent default form submission
                            e.preventDefault();
                            
                            // Trim the symptoms to handle spaces-only input
                            const symptomsValue = symptoms.trim();
                            console.log('Symptoms:', symptomsValue);
                            if(!symptomsValue) {
                              toast.error('Please enter your symptoms before submitting');
                              return;
                            }
                            
                            // Check if symptoms is empty
                            
                            
                            // Collect form data
                            const formData = {
                              symptoms: symptomsValue,
                              temperature: (document.getElementById('temperature') as HTMLInputElement)?.value || null,
                              temperatureUnit: (document.querySelector('select') as HTMLSelectElement)?.value || 'fahrenheit',
                              duration: document.querySelector('input[name="duration"]:checked') || null,
                              additionalInfo: additionalInfo.trim()
                            };
                            
                            console.log('Form data:', formData);
                            
                            // Show success toast and reset form
                            toast.success('Your health question has been submitted successfully');
                            
                            // Reset form fields
                            setSymptoms("");
                            setAdditionalInfo("");
                            
                            // Optionally reset other form elements
                            if (document.getElementById('temperature') as HTMLInputElement) {
                              (document.getElementById('temperature') as HTMLInputElement).value = '';
                            }
                            
                            const selectedRadio = document.querySelector('input[name="duration"]:checked') as HTMLInputElement;
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
                
                {/* Information about how it works - replaces the queries section */}
                <div className="mt-12 max-w-3xl mx-auto">
                  <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-3">How It Works</h3>
                  <div className="grid md:grid-cols-3 gap-6">
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

            {/* Right column - Health Tips only */}
            <div className="hidden md:block md:w-1/4 mt-6 md:mt-0">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Health Tips
                </h2>
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                      alt="Healthy Food" 
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3 bg-gray-50">
                      <h3 className="font-medium text-gray-900">Balanced Nutrition</h3>
                      <p className="text-sm text-gray-600 mt-1">Learn about essential nutrients for your daily diet</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-medium text-gray-900">Sleep Hygiene</h3>
                    <p className="text-sm text-gray-600 mt-1">Improve your sleep quality with these expert tips</p>
                    <a href="#" className="text-sm text-blue-600 mt-2 inline-block hover:underline">Read more →</a>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-medium text-gray-900">Daily Exercise</h3>
                    <p className="text-sm text-gray-600 mt-1">Simple exercises you can do at home</p>
                    <a href="#" className="text-sm text-blue-600 mt-2 inline-block hover:underline">Read more →</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SOS Button - Made responsive and properly fixed */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-5 rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm8-8a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          SOS
        </button>
      </div>
    </RootLayout>
  );
}
