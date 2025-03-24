"use client";

import { useState } from "react";

interface QueryResponseCardProps {
  query: {
    query: string;
    response: string;
    responseStatus: "waiting" | "ready" | "processing";
    approved: boolean;
    timestamp: string | Date;
  };
}

export default function QueryResponseCard({ query }: QueryResponseCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [modifiedResponse, setModifiedResponse] = useState(
    query.response || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClinician, setSelectedClinician] = useState("");
  
  // Format the date for display
  const formattedDate = new Date(query.timestamp).toLocaleString();
  
  // For UI demonstration purposes only
  const isClinicianView = true;

  // Function to parse and display structured AI response
  const renderStructuredResponse = (responseText: string) => {
    try {
      const jsonResponse = JSON.parse(responseText);
      if (typeof jsonResponse === "object" && jsonResponse !== null) {
        return (
          <div className="space-y-4">
            {Object.entries(jsonResponse).map(([key, value]) => (
              <div key={key} className="mb-4">
                <h4 className="text-md font-semibold capitalize mb-1">
                  {key.replace(/_/g, " ")}
                </h4>
                <p className="text-gray-700">{String(value)}</p>
              </div>
            ))}
          </div>
        );
      }
      return <p>{responseText}</p>;
    } catch (e) {
      console.error(e);
      return <p>{responseText}</p>;
    }
  };

  // Mock handlers for UI demonstrations
  const handleVerify = (approved: boolean) => {
    setIsSubmitting(true);
    // UI-only simulation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsEditing(false);
    }, 1000);
  };

  const handleReassign = () => {
    setIsSubmitting(true);
    // UI-only simulation
    setTimeout(() => {
      setIsSubmitting(false);
      setSelectedClinician("");
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="bg-blue-50 p-4 border-b border-blue-100">
        <h3 className="text-lg font-semibold text-blue-800">{query.query}</h3>
        <p className="text-sm text-gray-500">Submitted on {formattedDate}</p>
      </div>

      <div className="p-4">
        <div className="mb-4 flex items-center">
          <span className="text-sm font-medium mr-2">Status:</span>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              query.approved
                ? "bg-green-100 text-green-800"
                : query.responseStatus === "ready"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {query.approved
              ? "Approved"
              : query.responseStatus === "ready"
              ? "Awaiting Verification"
              : query.responseStatus === "waiting"
              ? "Waiting for AI"
              : "Processing"}
          </span>
        </div>

        {query.responseStatus === "waiting" ? (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            <span>Waiting for AI response...</span>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-md">
            {isEditing ? (
              <textarea
                value={modifiedResponse}
                onChange={(e) => setModifiedResponse(e.target.value)}
                className="w-full h-64 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            ) : (
              <div className="prose max-w-none">
                {renderStructuredResponse(query.response)}
              </div>
            )}
          </div>
        )}

        {isClinicianView &&
          query.responseStatus === "ready" &&
          !query.approved && (
            <div className="mt-4 space-y-4">
              {!isEditing ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    Edit Response
                  </button>
                  <button
                    onClick={() => handleVerify(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    Approve
                  </button>

                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedClinician}
                      onChange={(e) => setSelectedClinician(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Reassign to...</option>
                      <option value="general_practitioner">
                        General Practitioner
                      </option>
                      <option value="cardiologist">Cardiologist</option>
                      <option value="dermatologist">Dermatologist</option>
                      <option value="gastroenterologist">
                        Gastroenterologist
                      </option>
                      <option value="neurologist">Neurologist</option>
                    </select>
                    <button
                      onClick={handleReassign}
                      className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                      disabled={isSubmitting || !selectedClinician}
                    >
                      Reassign
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerify(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    Save & Approve
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}