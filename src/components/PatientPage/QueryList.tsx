"use client";

import { useState } from "react";
import QueryResponseCard from "@/components/PatientPage/QueryResponse";
import { useRouter } from "next/navigation";

// Define interface for query object for UI display
interface Query {
  _id: string;
  query: string;
  response: string;
  responseStatus: "waiting" | "ready" | "processing";
  approved: boolean;
  timestamp: string;
  patientId?: string;
  clinicianId?: string;
}

export default function QueryList() {
  // State for UI demonstration
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Sample data for UI demonstration
  const [queries, setQueries] = useState<Query[]>([
    {
      _id: "1",
      query: "What are the symptoms of seasonal allergies?",
      response: JSON.stringify({
        primary_symptoms: "Sneezing, runny nose, itchy eyes, and congestion are the main symptoms.",
        treatment_options: "Over-the-counter antihistamines, nasal sprays, and avoiding allergens can help manage symptoms.",
        when_to_see_doctor: "See a doctor if symptoms are severe, persist for more than two weeks, or if over-the-counter medications don't provide relief."
      }),
      responseStatus: "ready",
      approved: false,
      timestamp: new Date().toISOString()
    },
    {
      _id: "2",
      query: "How can I manage lower back pain?",
      response: JSON.stringify({
        causes: "Lower back pain can be caused by muscle strain, poor posture, herniated discs, or underlying conditions.",
        home_remedies: "Rest, ice/heat therapy, gentle stretches, and over-the-counter pain relievers can help.",
        prevention: "Maintain good posture, exercise regularly, lift properly, and strengthen core muscles."
      }),
      responseStatus: "ready",
      approved: true,
      timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      _id: "3",
      query: "Is my headache a migraine or tension headache?",
      response: "",
      responseStatus: "waiting",
      approved: false,
      timestamp: new Date().toISOString()
    }
  ]);

  // Simple UI-only handler for query updates
  const handleQueryUpdated = (updatedQuery: Query) => {
    setQueries(prevQueries => 
      prevQueries.map(q => q._id === updatedQuery._id ? updatedQuery : q)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-50 text-red-500 rounded-lg">
        <p>{error}</p>
        <button
          onClick={() => {
            router.refresh();
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (queries.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">No Queries Yet</h3>
        <p className="text-gray-600">
          You haven't submitted any health queries yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {queries.map((query) => (
        <QueryResponseCard
          key={query._id}
          query={query}
        />
      ))}
    </div>
  );
}